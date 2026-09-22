package com.taskflow.dto;

public class CommentDto {
    private String id;
    private String authorName;
    private String authorAvatar;
    private String content;
    private String createdAt;

    public CommentDto() {}

    public CommentDto(String id, String authorName, String authorAvatar, String content, String createdAt) {
        this.id = id;
        this.authorName = authorName;
        this.authorAvatar = authorAvatar;
        this.content = content;
        this.createdAt = createdAt;
    }

    public static CommentDtoBuilder builder() {
        return new CommentDtoBuilder();
    }

    public static class CommentDtoBuilder {
        private String id;
        private String authorName;
        private String authorAvatar;
        private String content;
        private String createdAt;

        public CommentDtoBuilder id(String id) { this.id = id; return this; }
        public CommentDtoBuilder authorName(String authorName) { this.authorName = authorName; return this; }
        public CommentDtoBuilder authorAvatar(String authorAvatar) { this.authorAvatar = authorAvatar; return this; }
        public CommentDtoBuilder content(String content) { this.content = content; return this; }
        public CommentDtoBuilder createdAt(String createdAt) { this.createdAt = createdAt; return this; }

        public CommentDto build() {
            return new CommentDto(id, authorName, authorAvatar, content, createdAt);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public String getAuthorAvatar() { return authorAvatar; }
    public void setAuthorAvatar(String authorAvatar) { this.authorAvatar = authorAvatar; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
