package com.taskflow.config;

import com.taskflow.entity.*;
import com.taskflow.repository.CommentRepository;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final CommentRepository commentRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            TaskRepository taskRepository,
            CommentRepository commentRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
        this.commentRepository = commentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        // 1. Seed Admin
        User admin = User.builder()
                .name("Alexander Wright")
                .email("admin@taskflow.com")
                .password(passwordEncoder.encode("password123"))
                .role(Role.ADMIN)
                .department("Engineering Leadership")
                .avatar("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80")
                .status("Active")
                .build();
        userRepository.save(admin);

        // 2. Seed Users
        User sarah = User.builder()
                .name("Sarah Jenkins")
                .email("sarah.jenkins@taskflow.com")
                .password(passwordEncoder.encode("password123"))
                .role(Role.USER)
                .department("Frontend Engineering")
                .avatar("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80")
                .status("Active")
                .build();
        userRepository.save(sarah);

        User alex = User.builder()
                .name("Alex Rivera")
                .email("alex.rivera@taskflow.com")
                .password(passwordEncoder.encode("password123"))
                .role(Role.USER)
                .department("Backend Platform")
                .avatar("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80")
                .status("Active")
                .build();
        userRepository.save(alex);

        User david = User.builder()
                .name("David Kim")
                .email("david.kim@taskflow.com")
                .password(passwordEncoder.encode("password123"))
                .role(Role.USER)
                .department("QA & Automation")
                .avatar("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80")
                .status("Active")
                .build();
        userRepository.save(david);

        // 3. Seed Tasks
        Task t1 = Task.builder()
                .title("Architect JWT Security Filter Chain in Spring Boot")
                .description("Implement stateless JWT token validation interceptor and configure Spring Security 6 role-based path matchers.")
                .assignedTo(alex)
                .priority(TaskPriority.High)
                .status(TaskStatus.InProgress)
                .dueDate(LocalDate.now().plusDays(3))
                .build();
        taskRepository.save(t1);

        Comment c1 = Comment.builder()
                .content("Ensure token expiration is set to 24 hours with refresh capability.")
                .authorName("Alexander Wright")
                .authorAvatar(admin.getAvatar())
                .task(t1)
                .createdAt(LocalDateTime.now().minusDays(2))
                .build();
        commentRepository.save(c1);

        Task t2 = Task.builder()
                .title("Build Responsive Sidebar and Header Shell")
                .description("Develop responsive navigation drawer for mobile and desktop slate sidebar following Tailwind 2563EB design guidelines.")
                .assignedTo(sarah)
                .priority(TaskPriority.High)
                .status(TaskStatus.Completed)
                .dueDate(LocalDate.now().minusDays(1))
                .build();
        taskRepository.save(t2);

        Task t3 = Task.builder()
                .title("Design Modal Dialog and Form System for Task Creation")
                .description("Create reusable Modal component with focus trap, backdrop dismissal, and validation states for creating tasks.")
                .assignedTo(sarah)
                .priority(TaskPriority.Medium)
                .status(TaskStatus.InProgress)
                .dueDate(LocalDate.now().plusDays(2))
                .build();
        taskRepository.save(t3);

        Task t4 = Task.builder()
                .title("Automated E2E Role Navigation Test Suites")
                .description("Set up automated tests to ensure users cannot access /admin/users or unauthorized task modification endpoints.")
                .assignedTo(david)
                .priority(TaskPriority.Medium)
                .status(TaskStatus.Pending)
                .dueDate(LocalDate.now().plusDays(6))
                .build();
        taskRepository.save(t4);
    }
}
