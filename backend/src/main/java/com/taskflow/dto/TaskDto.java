package com.taskflow.dto;

import com.taskflow.entity.TaskPriority;
import com.taskflow.entity.TaskStatus;
import java.util.ArrayList;
import java.util.List;

public class TaskDto {
    private String id;
    private String title;
    private String description;
    private String assignedToId;
    private TaskPriority priority;
    private TaskStatus status;
    private String dueDate;
    private String createdAt;
    private List<CommentDto> comments = new ArrayList<>();

    public TaskDto() {}

    public TaskDto(String id, String title, String description, String assignedToId, TaskPriority priority, TaskStatus status, String dueDate, String createdAt, List<CommentDto> comments) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.assignedToId = assignedToId;
        this.priority = priority;
        this.status = status;
        this.dueDate = dueDate;
        this.createdAt = createdAt;
        this.comments = comments != null ? comments : new ArrayList<>();
    }

    public static TaskDtoBuilder builder() {
        return new TaskDtoBuilder();
    }

    public static class TaskDtoBuilder {
        private String id;
        private String title;
        private String description;
        private String assignedToId;
        private TaskPriority priority;
        private TaskStatus status;
        private String dueDate;
        private String createdAt;
        private List<CommentDto> comments = new ArrayList<>();

        public TaskDtoBuilder id(String id) { this.id = id; return this; }
        public TaskDtoBuilder title(String title) { this.title = title; return this; }
        public TaskDtoBuilder description(String description) { this.description = description; return this; }
        public TaskDtoBuilder assignedToId(String assignedToId) { this.assignedToId = assignedToId; return this; }
        public TaskDtoBuilder priority(TaskPriority priority) { this.priority = priority; return this; }
        public TaskDtoBuilder status(TaskStatus status) { this.status = status; return this; }
        public TaskDtoBuilder dueDate(String dueDate) { this.dueDate = dueDate; return this; }
        public TaskDtoBuilder createdAt(String createdAt) { this.createdAt = createdAt; return this; }
        public TaskDtoBuilder comments(List<CommentDto> comments) { this.comments = comments; return this; }

        public TaskDto build() {
            return new TaskDto(id, title, description, assignedToId, priority, status, dueDate, createdAt, comments);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAssignedToId() { return assignedToId; }
    public void setAssignedToId(String assignedToId) { this.assignedToId = assignedToId; }

    public TaskPriority getPriority() { return priority; }
    public void setPriority(TaskPriority priority) { this.priority = priority; }

    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { this.status = status; }

    public String getDueDate() { return dueDate; }
    public void setDueDate(String dueDate) { this.dueDate = dueDate; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public List<CommentDto> getComments() { return comments; }
    public void setComments(List<CommentDto> comments) { this.comments = comments; }
}
