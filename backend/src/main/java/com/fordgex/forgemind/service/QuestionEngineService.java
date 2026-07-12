package com.fordgex.forgemind.service;

import com.fordgex.forgemind.entity.*;
import com.fordgex.forgemind.exception.BusinessException;
import com.fordgex.forgemind.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class QuestionEngineService {

    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final RequirementRepository requirementRepository;
    private final RequirementCategoryRepository categoryRepository;
    private final AuditLogRepository auditLogRepository;
    private final ProjectRepository projectRepository;

    public QuestionEngineService(
            QuestionRepository questionRepository,
            AnswerRepository answerRepository,
            RequirementRepository requirementRepository,
            RequirementCategoryRepository categoryRepository,
            AuditLogRepository auditLogRepository,
            ProjectRepository projectRepository) {
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
        this.requirementRepository = requirementRepository;
        this.categoryRepository = categoryRepository;
        this.auditLogRepository = auditLogRepository;
        this.projectRepository = projectRepository;
    }

    /**
     * Initializes questions for a new project based on keywords in the project name or description.
     */
    @Transactional
    public void initializeProjectQuestions(Project project) {
        String input = (project.getName() + " " + (project.getDescription() != null ? project.getDescription() : ""))
                .toLowerCase();

        List<TempQuestion> templates = new ArrayList<>();

        if (input.contains("hospital") || input.contains("patient") || input.contains("clinic") || input.contains("medical")) {
            // Hospital Management System Templates
            templates.add(new TempQuestion(0, "CORE_FUNCTIONALITY", "What is the primary target facility?", "Single Hospital, Multi-Hospital Chain", null, null));
            templates.add(new TempQuestion(1, "USER_INTERFACE", "Do you need a centralized patient portal for online booking?", "Yes, No", null, null));
            // Conditional on Patient Portal = Yes (will resolve to order index 1 Question ID once database IDs are created)
            templates.add(new TempQuestion(2, "USER_INTERFACE", "Do patients need to upload documents/prescriptions?", "Yes, No", 1, "Yes"));
            templates.add(new TempQuestion(3, "CORE_FUNCTIONALITY", "Do you need billing and invoice generation?", "Yes, No", null, null));
            // Conditional on Billing = Yes
            templates.add(new TempQuestion(4, "INTEGRATIONS", "Do you require insurance provider integration?", "Yes, No", 3, "Yes"));
            templates.add(new TempQuestion(5, "SECURITY_COMPLIANCE", "Which standard must the patient data security comply with?", "HIPAA Compliant, Basic Role Access", null, null));
            templates.add(new TempQuestion(6, "REPORTING_ANALYTICS", "Do you need custom analytical reports for laboratory and pharmacy stocks?", "Yes, No", null, null));
        } else if (input.contains("food") || input.contains("delivery") || input.contains("restaurant") || input.contains("eat")) {
            // Food Delivery Templates
            templates.add(new TempQuestion(0, "CORE_FUNCTIONALITY", "What is the delivery model?", "Single Restaurant, Multi-Restaurant Aggregator", null, null));
            templates.add(new TempQuestion(1, "CORE_FUNCTIONALITY", "How are delivery personnel managed?", "Internal Drivers, External Contractors, Self-Pickup Only", null, null));
            templates.add(new TempQuestion(2, "INTEGRATIONS", "Do you need real-time GPS tracking for delivery drivers?", "Yes, No", null, null));
            templates.add(new TempQuestion(3, "INTEGRATIONS", "Which map API provider do you prefer?", "Google Maps, Mapbox, OpenStreetMap", 2, "Yes"));
            templates.add(new TempQuestion(4, "INTEGRATIONS", "Which payment systems should be integrated?", "Credit Card (Stripe), PayPal, Cash on Delivery", null, null));
            templates.add(new TempQuestion(5, "SECURITY_COMPLIANCE", "Do you require GDPR compliance for customer data?", "Yes, No", null, null));
        } else if (input.contains("college") || input.contains("school") || input.contains("university") || input.contains("academy") || input.contains("erp")) {
            // College ERP / School Templates
            templates.add(new TempQuestion(0, "CORE_FUNCTIONALITY", "What grade levels does this system target?", "Higher Education/Universities, K-12 Schooling", null, null));
            templates.add(new TempQuestion(1, "CORE_FUNCTIONALITY", "Do you need automated attendance tracking?", "Yes, No", null, null));
            templates.add(new TempQuestion(2, "INTEGRATIONS", "How should attendance be marked?", "RFID/Biometric Sync, Teacher Manual Entry, Student Self-CheckIn", 1, "Yes"));
            templates.add(new TempQuestion(3, "USER_INTERFACE", "Do you need parent communication portal access?", "Yes, No", null, null));
            templates.add(new TempQuestion(4, "INTEGRATIONS", "Do you need an integrated online payment system for tuition fees?", "Yes, No", null, null));
        } else if (input.contains("inventory") || input.contains("stock") || input.contains("warehouse")) {
            // Inventory System
            templates.add(new TempQuestion(0, "CORE_FUNCTIONALITY", "What is the storage architecture?", "Single Warehouse, Multi-Warehouse Distribution", null, null));
            templates.add(new TempQuestion(1, "INTEGRATIONS", "Do you require barcode/QR code scanner integration?", "Yes, No", null, null));
            templates.add(new TempQuestion(2, "CORE_FUNCTIONALITY", "Do you need automatic low-stock notifications?", "Yes, No", null, null));
            templates.add(new TempQuestion(3, "INTEGRATIONS", "Which email provider should send notifications?", "SendGrid, SMTP Local Server", 2, "Yes"));
        } else {
            // General Software Template (Fallback)
            templates.add(new TempQuestion(0, "CORE_FUNCTIONALITY", "What is the target hosting environment?", "Cloud Hosted (AWS/GCP), On-Premises Bare Metal, Hybrid Setup", null, null));
            templates.add(new TempQuestion(1, "SECURITY_COMPLIANCE", "What authentication standard is required?", "Email and Password (JWT), Single Sign-On (SSO / SAML), Social Logins", null, null));
            templates.add(new TempQuestion(2, "INTEGRATIONS", "Do you need third-party payment integration?", "Yes, No", null, null));
            templates.add(new TempQuestion(3, "INTEGRATIONS", "Which payment provider?", "Stripe, PayPal, Both", 2, "Yes"));
            templates.add(new TempQuestion(4, "REPORTING_ANALYTICS", "Do you need a real-time analytics dashboard?", "Yes, No", null, null));
        }

        // Map categories first to ensure quick lookup
        Map<String, RequirementCategory> catMap = categoryRepository.findAll().stream()
                .collect(Collectors.toMap(RequirementCategory::getName, cat -> cat));

        // Save questions in order and link conditional dependency IDs
        Map<Integer, Question> savedQuestionMap = new HashMap<>();

        for (TempQuestion t : templates) {
            RequirementCategory category = catMap.get(t.categoryName);
            if (category == null) {
                category = categoryRepository.save(new RequirementCategory(t.categoryName, t.categoryName + " category description"));
                catMap.put(t.categoryName, category);
            }

            Question question = new Question();
            question.setProject(project);
            question.setCategory(category);
            question.setText(t.text);
            question.setOptions(t.options);
            question.setOrderIndex(t.orderIndex);
            question.setAnswered(false);

            Question saved = questionRepository.save(question);
            savedQuestionMap.put(t.orderIndex, saved);
        }

        // Resolve dependencies
        for (TempQuestion t : templates) {
            if (t.dependencyIndex != null) {
                Question parent = savedQuestionMap.get(t.dependencyIndex);
                Question current = savedQuestionMap.get(t.orderIndex);
                if (parent != null && current != null) {
                    current.setDependencyQuestionId(parent.getId());
                    current.setDependencyAnswer(t.dependencyAnswer);
                    questionRepository.save(current);
                }
            }
        }
    }

    /**
     * Retrieves the next unanswered active question for the project.
     */
    @Transactional(readOnly = true)
    public Optional<Question> getNextQuestion(Long projectId) {
        List<Question> questions = questionRepository.findByProjectIdOrderByOrderIndexAsc(projectId);
        List<Answer> answers = answerRepository.findByProjectId(projectId);

        Map<Long, Answer> answerMap = answers.stream()
                .collect(Collectors.toMap(a -> a.getQuestion().getId(), a -> a));

        for (Question q : questions) {
            if (!q.isAnswered()) {
                if (isQuestionActive(q, answerMap)) {
                    return Optional.of(q);
                }
            }
        }
        return Optional.empty();
    }

    /**
     * Calculates the active question completion progress for a project.
     */
    @Transactional(readOnly = true)
    public int calculateProgress(Long projectId) {
        List<Question> questions = questionRepository.findByProjectIdOrderByOrderIndexAsc(projectId);
        List<Answer> answers = answerRepository.findByProjectId(projectId);

        Map<Long, Answer> answerMap = answers.stream()
                .collect(Collectors.toMap(a -> a.getQuestion().getId(), a -> a));

        int totalActive = 0;
        int answeredActive = 0;

        for (Question q : questions) {
            if (isQuestionActive(q, answerMap)) {
                totalActive++;
                if (q.isAnswered()) {
                    answeredActive++;
                }
            }
        }

        if (totalActive == 0) return 100;
        return (answeredActive * 100) / totalActive;
    }

    /**
     * Determines whether a question is active based on current answers.
     */
    private boolean isQuestionActive(Question q, Map<Long, Answer> answerMap) {
        if (q.getDependencyQuestionId() == null) {
            return true;
        }
        Answer parentAnswer = answerMap.get(q.getDependencyQuestionId());
        return parentAnswer != null && Objects.equals(parentAnswer.getSelectedOption(), q.getDependencyAnswer());
    }

    /**
     * Generates standard requirements catalog based on the answer keys.
     */
    @Transactional
    public void compileRequirements(Project project, User user) {
        List<Question> questions = questionRepository.findByProjectIdOrderByOrderIndexAsc(project.getId());
        List<Answer> answers = answerRepository.findByProjectId(project.getId());

        Map<Long, Answer> answerMap = answers.stream()
                .collect(Collectors.toMap(a -> a.getQuestion().getId(), a -> a));

        // Clean any existing compiled requirements for this project
        List<Requirement> existing = requirementRepository.findByProjectIdOrderByCategoryNameAsc(project.getId());
        requirementRepository.deleteAll(existing);

        for (Question q : questions) {
            if (isQuestionActive(q, answerMap) && q.isAnswered()) {
                Answer ans = answerMap.get(q.getId());
                if (ans != null) {
                    List<RequirementTemplate> reqTemplates = getRequirementsForAnswer(q.getText(), ans.getSelectedOption());
                    for (RequirementTemplate rt : reqTemplates) {
                        Requirement r = new Requirement();
                        r.setProject(project);
                        r.setCategory(q.getCategory());
                        r.setTitle(rt.title);
                        r.setDescription(rt.description);
                        r.setStatus("APPROVED");
                        requirementRepository.save(r);
                    }
                }
            }
        }

        project.setStatus("COMPLETED");
        project.setProgress(100);
        projectRepository.save(project);

        auditLogRepository.save(new AuditLog(project, user, "COMPILE_REQUIREMENTS", "Successfully compiled structured specification requirements."));
    }

    /**
     * Map questions and selected options directly to dynamic system requirements.
     */
    private List<RequirementTemplate> getRequirementsForAnswer(String questionText, String option) {
        List<RequirementTemplate> list = new ArrayList<>();

        // Hospital Management System Requirements mapping
        if (questionText.contains("primary target facility")) {
            if (option.contains("Single Hospital")) {
                list.add(new RequirementTemplate("Single-Facility Operations", "The platform shall configure dashboard and data views localized to a single medical center deployment."));
            } else {
                list.add(new RequirementTemplate("Multi-Tenant Administration", "The system shall implement multi-facility configurations allowing central admins to manage medical structures, rooms, and staff across distinct hospitals."));
            }
        } else if (questionText.contains("patient portal")) {
            if (option.equalsIgnoreCase("Yes")) {
                list.add(new RequirementTemplate("Patient Portal Access", "The platform shall provide patient portal views enabling patients to book doctor appointments, track consult histories, and view clinic schedules online."));
            } else {
                list.add(new RequirementTemplate("Administrative Intake Core", "The application shall rely exclusively on clinical registrars for administrative patient intake and scheduling workflows."));
            }
        } else if (questionText.contains("upload documents")) {
            if (option.equalsIgnoreCase("Yes")) {
                list.add(new RequirementTemplate("Medical Record File Ingestion", "The patient portal shall support secure binary uploads of prescriptions, scan reports, and external patient medical summaries."));
            }
        } else if (questionText.contains("billing and invoice")) {
            if (option.equalsIgnoreCase("Yes")) {
                list.add(new RequirementTemplate("Automated Billing Ledger", "The platform shall automatically calculate consultation costs, generate transaction invoices, and trace patient payment status."));
            }
        } else if (questionText.contains("insurance provider")) {
            if (option.equalsIgnoreCase("Yes")) {
                list.add(new RequirementTemplate("Electronic Claims Clearinghouse", "The billing interface shall route patient insurance details to configured healthcare clearinghouses for claim validation."));
            }
        } else if (questionText.contains("patient data security")) {
            if (option.contains("HIPAA")) {
                list.add(new RequirementTemplate("HIPAA Audit Ledger", "The system shall implement end-to-end TLS encryption, secure database hashing for Patient Health Information (PHI), and trace all file logs."));
            } else {
                list.add(new RequirementTemplate("Standard Access Control", "The system shall implement basic role-based access limits protecting patient entity structures."));
            }
        } else if (questionText.contains("pharmacy stocks")) {
            if (option.equalsIgnoreCase("Yes")) {
                list.add(new RequirementTemplate("Pharmaceutical Inventory Tracking", "The system shall track live queues of medication stocks and report warnings for low threshold balances."));
            }
        }

        // Food Delivery Platform Requirements mapping
        else if (questionText.contains("delivery model")) {
            if (option.contains("Single Restaurant")) {
                list.add(new RequirementTemplate("Single Store Checkout", "The system shall process carts and orders originating exclusively from one unified kitchen dashboard."));
            } else {
                list.add(new RequirementTemplate("Multi-Vendor Marketplace", "The client interface shall host catalog indexing and search for multiple concurrent restaurant listings."));
            }
        } else if (questionText.contains("delivery personnel")) {
            if (option.contains("Internal Drivers")) {
                list.add(new RequirementTemplate("Fleet Scheduling Panel", "The admin system shall allocate incoming orders directly to internal driver shift lines."));
            } else if (option.contains("External Contractors")) {
                list.add(new RequirementTemplate("Driver Geolocation Offer Pipeline", "The platform shall publish courier job bids to nearby freelance delivery contractors."));
            }
        } else if (questionText.contains("GPS tracking")) {
            if (option.equalsIgnoreCase("Yes")) {
                list.add(new RequirementTemplate("Live Driver Tracking Stream", "The client interface shall pull WebSocket updates mapping couriers' live GPS updates."));
            }
        } else if (questionText.contains("map API provider")) {
            list.add(new RequirementTemplate("Spatial Map Visualization", "The system shall render path routes using " + option + " maps API integration."));
        } else if (questionText.contains("payment systems")) {
            list.add(new RequirementTemplate("Financial Transaction Processing", "The gateway must process order checkouts utilizing " + option + " endpoints."));
        } else if (questionText.contains("GDPR compliance")) {
            if (option.equalsIgnoreCase("Yes")) {
                list.add(new RequirementTemplate("Data Erasure Interface", "The system shall enable customers to submit data purge requests in compliance with GDPR."));
            }
        }

        // College ERP Requirements mapping
        else if (questionText.contains("grade levels")) {
            list.add(new RequirementTemplate("Academic Term Model", "The system curriculum structures shall configure database fields optimized for " + option + "."));
        } else if (questionText.contains("attendance tracking")) {
            if (option.equalsIgnoreCase("Yes")) {
                list.add(new RequirementTemplate("Student Attendance Auditing", "The registry shall logs daily class attendance counts."));
            }
        } else if (questionText.contains("attendance be marked")) {
            list.add(new RequirementTemplate("Attendance Intake System", "The attendance ledger shall ingest updates from the " + option + " workflow."));
        } else if (questionText.contains("parent communication")) {
            if (option.equalsIgnoreCase("Yes")) {
                list.add(new RequirementTemplate("Parent Portal Accounts", "The authentication filter shall support secure logins for parent accounts."));
            }
        } else if (questionText.contains("online payment system")) {
            if (option.equalsIgnoreCase("Yes")) {
                list.add(new RequirementTemplate("Tuition Payment Invoice", "The module shall enable parents and students to settle outstanding school fees online."));
            }
        }

        // Inventory System mapping
        else if (questionText.contains("storage architecture")) {
            list.add(new RequirementTemplate("Warehouse Inventory Model", "The system shall coordinate stocks according to a " + option + "."));
        } else if (questionText.contains("barcode/QR code")) {
            if (option.equalsIgnoreCase("Yes")) {
                list.add(new RequirementTemplate("Camera Scanner Integration", "The UI client shall capture device camera feeds to parse product barcodes."));
            }
        } else if (questionText.contains("low-stock notifications")) {
            if (option.equalsIgnoreCase("Yes")) {
                list.add(new RequirementTemplate("Threshold Alerts Service", "The backend worker shall scan inventory balances and trigger email warnings."));
            }
        } else if (questionText.contains("email provider")) {
            list.add(new RequirementTemplate("Mail Routing Client", "The notification system shall dispatch emails utilizing " + option + "."));
        }

        // General fallback mapping
        else if (questionText.contains("hosting environment")) {
            list.add(new RequirementTemplate("Infrastructure Hosting Setup", "The application deployment architecture shall target " + option + "."));
        } else if (questionText.contains("authentication standard")) {
            list.add(new RequirementTemplate("User Credentials Verification", "The authorization security stack shall authorize users via " + option + "."));
        } else if (questionText.contains("payment integration")) {
            if (option.equalsIgnoreCase("Yes")) {
                list.add(new RequirementTemplate("Billing Payment Pipeline", "The platform shall configure external checkout payment handlers."));
            }
        } else if (questionText.contains("payment provider")) {
            list.add(new RequirementTemplate("Credit Payment Gateways", "The system shall route card token charges to " + option + "."));
        } else if (questionText.contains("analytics dashboard")) {
            if (option.equalsIgnoreCase("Yes")) {
                list.add(new RequirementTemplate("Real-Time KPI Panel", "The application dashboard shall compute database aggregates to display telemetry charts."));
            }
        }

        // Generic fallback to ensure requirement exists
        if (list.isEmpty()) {
            list.add(new RequirementTemplate("Dynamic Custom Module Setup", "Configure application components dynamically matching user selection for " + option));
        }

        return list;
    }

    private static class TempQuestion {
        int orderIndex;
        String categoryName;
        String text;
        String options;
        Integer dependencyIndex;
        String dependencyAnswer;

        TempQuestion(int orderIndex, String categoryName, String text, String options, Integer dependencyIndex, String dependencyAnswer) {
            this.orderIndex = orderIndex;
            this.categoryName = categoryName;
            this.text = text;
            this.options = options;
            this.dependencyIndex = dependencyIndex;
            this.dependencyAnswer = dependencyAnswer;
        }
    }

    private static class RequirementTemplate {
        String title;
        String description;

        RequirementTemplate(String title, String description) {
            this.title = title;
            this.description = description;
        }
    }
}
