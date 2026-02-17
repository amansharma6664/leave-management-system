package com.leavemanagement.dto;

import com.leavemanagement.model.Leave.LeaveStatus;
import com.leavemanagement.model.Leave.LeaveType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class LeaveDTO {
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LeaveRequest {
        @NotNull(message = "Start date is required")
        private LocalDate startDate;
        
        @NotNull(message = "End date is required")
        private LocalDate endDate;
        
        @NotNull(message = "Leave type is required")
        private LeaveType leaveType;
        
        private String reason;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LeaveResponse {
        private Long id;
        private Long userId;
        private String userName;
        private String userEmail;
        private String department;
        private LocalDate startDate;
        private LocalDate endDate;
        private Integer numberOfDays;
        private LeaveType leaveType;
        private String reason;
        private LeaveStatus status;
        private String approvedByName;
        private String managerComments;
        private LocalDateTime approvedAt;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LeaveApprovalRequest {
        @NotNull(message = "Status is required")
        private LeaveStatus status;
        
        private String managerComments;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LeaveBalanceResponse {
        private Double totalBalance;
        private Double usedLeave;
        private Double remainingBalance;
        private Long pendingRequests;
    }
}
