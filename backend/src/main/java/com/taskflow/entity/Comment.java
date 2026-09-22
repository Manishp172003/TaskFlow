package com.taskflow.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    private String authorName;

    private String authorAvatar;

    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    public Comment() {}

    public Comment(Long id, String content, String authorName, String authorAvatar, LocalDateTime createdAt, Task task) {
        this.id = id;
        this.content = content;
        this.authorName = authorName;
        this.authorAvatar = authorAvatar;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
        this.task = task;
    }

    public static CommentBuilder builder() {
        return new CommentBuilder();
    }

    public static class CommentBuilder {
        private Long id;
        private String content;
        private String authorName;
        private String authorAvatar;
        private LocalDateTime createdAt = LocalDateTime.now();
        private Task task;

        public CommentBuilder id(Long id) { this.id = id; return this; }
        public CommentBuilder content(String content) { this.content = content; return this; }
        public CommentBuilder authorName(String authorName) { this.authorName = authorName; return this; }
        public CommentBuilder authorAvatar(String authorAvatar) { this.authorAvatar = authorAvatar; return this; }
        public CommentBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public CommentBuilder task(Task task) { this.task = task; return this; }

        public Comment build() {
            return new Comment(id, content, authorName, authorAvatar, createdAt, task);
        }
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public String getAuthorAvatar() { return authorAvatar; }
    public void setAuthorAvatar(String authorAvatar) { this.authorAvatar = authorAvatar; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Task getTask() { return task; }
    public void setTask(Task task) { this.task = task; }
}
