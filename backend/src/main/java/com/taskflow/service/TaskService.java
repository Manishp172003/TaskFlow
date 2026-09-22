package com.taskflow.service;

import com.taskflow.dto.CommentDto;
import com.taskflow.dto.TaskDto;
import com.taskflow.entity.*;
import com.taskflow.repository.CommentRepository;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository, CommentRepository commentRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
    }

    public List<TaskDto> getTasks(TaskStatus status, TaskPriority priority, Long assignedToId, String search) {
        return taskRepository.findFilteredTasks(status, priority, assignedToId, search).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public TaskDto getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
        return mapToDto(task);
    }

    @Transactional
    public TaskDto createTask(TaskDto dto) {
        User assignee = null;
        if (dto.getAssignedToId() != null && !dto.getAssignedToId().isBlank()) {
            Long userId = Long.parseLong(dto.getAssignedToId().replace("usr_", ""));
            assignee = userRepository.findById(userId).orElse(null);
        }

        LocalDate due = dto.getDueDate() != null && !dto.getDueDate().isBlank()
                ? LocalDate.parse(dto.getDueDate())
                : LocalDate.now().plusDays(7);

        Task task = Task.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .assignedTo(assignee)
                .priority(dto.getPriority() != null ? dto.getPriority() : TaskPriority.Medium)
                .status(dto.getStatus() != null ? dto.getStatus() : TaskStatus.Pending)
                .dueDate(due)
                .build();

        Task saved = taskRepository.save(task);
        return mapToDto(saved);
    }

    @Transactional
    public TaskDto updateTask(Long id, TaskDto dto) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));

        if (dto.getTitle() != null) task.setTitle(dto.getTitle());
        if (dto.getDescription() != null) task.setDescription(dto.getDescription());
        if (dto.getPriority() != null) task.setPriority(dto.getPriority());
        if (dto.getStatus() != null) task.setStatus(dto.getStatus());
        if (dto.getDueDate() != null && !dto.getDueDate().isBlank()) {
            task.setDueDate(LocalDate.parse(dto.getDueDate()));
        }
        if (dto.getAssignedToId() != null && !dto.getAssignedToId().isBlank()) {
            Long userId = Long.parseLong(dto.getAssignedToId().replace("usr_", ""));
            User assignee = userRepository.findById(userId).orElse(null);
            task.setAssignedTo(assignee);
        }

        Task saved = taskRepository.save(task);
        return mapToDto(saved);
    }

    @Transactional
    public TaskDto updateTaskStatus(Long id, TaskStatus status) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
        task.setStatus(status);
        Task saved = taskRepository.save(task);
        return mapToDto(saved);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    @Transactional
    public CommentDto addComment(Long taskId, CommentDto commentDto) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        Comment comment = Comment.builder()
                .content(commentDto.getContent())
                .authorName(commentDto.getAuthorName())
                .authorAvatar(commentDto.getAuthorAvatar())
                .task(task)
                .build();

        Comment saved = commentRepository.save(comment);

        return CommentDto.builder()
                .id(saved.getId().toString())
                .content(saved.getContent())
                .authorName(saved.getAuthorName())
                .authorAvatar(saved.getAuthorAvatar())
                .createdAt(saved.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")))
                .build();
    }

    private TaskDto mapToDto(Task task) {
        List<CommentDto> comments = task.getComments() != null
                ? task.getComments().stream()
                .map(c -> CommentDto.builder()
                        .id(c.getId().toString())
                        .content(c.getContent())
                        .authorName(c.getAuthorName())
                        .authorAvatar(c.getAuthorAvatar())
                        .createdAt(c.getCreatedAt() != null ? c.getCreatedAt().toString() : "")
                        .build())
                .collect(Collectors.toList())
                : List.of();

        return TaskDto.builder()
                .id("TSK-" + task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .assignedToId(task.getAssignedTo() != null ? task.getAssignedTo().getId().toString() : null)
                .priority(task.getPriority())
                .status(task.getStatus())
                .dueDate(task.getDueDate() != null ? task.getDueDate().toString() : null)
                .createdAt(task.getCreatedAt() != null ? task.getCreatedAt().toString() : null)
                .comments(comments)
                .build();
    }
}
