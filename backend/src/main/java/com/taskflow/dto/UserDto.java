package com.taskflow.dto;

import com.taskflow.entity.Role;

public class UserDto {
    private String id;
    private String name;
    private String email;
    private String password;
    private Role role;
    private String department;
    private String avatar;
    private String status;
    private int assignedTasksCount;

    public UserDto() {}

    public UserDto(String id, String name, String email, String password, Role role, String department, String avatar, String status, int assignedTasksCount) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.department = department;
        this.avatar = avatar;
        this.status = status;
        this.assignedTasksCount = assignedTasksCount;
    }

    public static UserDtoBuilder builder() {
        return new UserDtoBuilder();
    }

    public static class UserDtoBuilder {
        private String id;
        private String name;
        private String email;
        private String password;
        private Role role;
        private String department;
        private String avatar;
        private String status;
        private int assignedTasksCount;

        public UserDtoBuilder id(String id) { this.id = id; return this; }
        public UserDtoBuilder name(String name) { this.name = name; return this; }
        public UserDtoBuilder email(String email) { this.email = email; return this; }
        public UserDtoBuilder password(String password) { this.password = password; return this; }
        public UserDtoBuilder role(Role role) { this.role = role; return this; }
        public UserDtoBuilder department(String department) { this.department = department; return this; }
        public UserDtoBuilder avatar(String avatar) { this.avatar = avatar; return this; }
        public UserDtoBuilder status(String status) { this.status = status; return this; }
        public UserDtoBuilder assignedTasksCount(int assignedTasksCount) { this.assignedTasksCount = assignedTasksCount; return this; }

        public UserDto build() {
            return new UserDto(id, name, email, password, role, department, avatar, status, assignedTasksCount);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getAssignedTasksCount() { return assignedTasksCount; }
    public void setAssignedTasksCount(int assignedTasksCount) { this.assignedTasksCount = assignedTasksCount; }
}
