package com.leavemanagement.service;

import com.leavemanagement.dto.LeaveDTO;
import com.leavemanagement.model.Leave;
import com.leavemanagement.model.Leave.LeaveStatus;
import com.leavemanagement.model.User;
import com.leavemanagement.repository.LeaveRepository;
import com.leavemanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaveService {
    
    @Autowired
    private LeaveRepository leaveRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Transactional
    public LeaveDTO.LeaveResponse applyLeave(String username, LeaveDTO.LeaveRequest request) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Validate dates
        if (request.getStartDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Start date cannot be in the past");
        }
        
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new RuntimeException("End date cannot be before start date");
        }
        
        // Calculate number of days
        int numberOfDays = (int) ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;
        
        // Check for overlapping leaves
        List<Leave> overlapping = leaveRepository.findOverlappingLeaves(
            user.getId(), request.getStartDate(), request.getEndDate()
        );
        
        if (!overlapping.isEmpty()) {
            throw new RuntimeException("You already have a leave request for these dates");
        }
        
        // Check leave balance
        if (user.getLeaveBalance() < numberOfDays) {
            throw new RuntimeException("Insufficient leave balance. Available: " + user.getLeaveBalance() + " days");
        }
        
        Leave leave = new Leave();
        leave.setUser(user);
        leave.setStartDate(request.getStartDate());
        leave.setEndDate(request.getEndDate());
        leave.setNumberOfDays(numberOfDays);
        leave.setLeaveType(request.getLeaveType());
        leave.setReason(request.getReason());
        leave.setStatus(LeaveStatus.PENDING);
        
        leave = leaveRepository.save(leave);
        
        return mapToResponse(leave);
    }
    
    public List<LeaveDTO.LeaveResponse> getMyLeaves(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        return leaveRepository.findByUserOrderByCreatedAtDesc(user).stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    public List<LeaveDTO.LeaveResponse> getAllLeaves() {
        return leaveRepository.findAllByOrderByCreatedAtDesc().stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    public List<LeaveDTO.LeaveResponse> getPendingLeaves() {
        return leaveRepository.findByStatus(LeaveStatus.PENDING).stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public LeaveDTO.LeaveResponse approveOrRejectLeave(String managerUsername, Long leaveId, 
                                                        LeaveDTO.LeaveApprovalRequest request) {
        User manager = userRepository.findByUsername(managerUsername)
            .orElseThrow(() -> new RuntimeException("Manager not found"));
        
        Leave leave = leaveRepository.findById(leaveId)
            .orElseThrow(() -> new RuntimeException("Leave request not found"));
        
        if (leave.getStatus() != LeaveStatus.PENDING) {
            throw new RuntimeException("Leave request is already processed");
        }
        
        leave.setStatus(request.getStatus());
        leave.setApprovedBy(manager);
        leave.setManagerComments(request.getManagerComments());
        leave.setApprovedAt(LocalDateTime.now());
        
        // Update user leave balance if approved
        if (request.getStatus() == LeaveStatus.APPROVED) {
            User user = leave.getUser();
            user.setLeaveBalance(user.getLeaveBalance() - leave.getNumberOfDays());
            userRepository.save(user);
        }
        
        leave = leaveRepository.save(leave);
        
        return mapToResponse(leave);
    }
    
    @Transactional
    public void cancelLeave(String username, Long leaveId) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Leave leave = leaveRepository.findById(leaveId)
            .orElseThrow(() -> new RuntimeException("Leave request not found"));
        
        if (!leave.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only cancel your own leave requests");
        }
        
        if (leave.getStatus() == LeaveStatus.APPROVED) {
            // Restore leave balance
            user.setLeaveBalance(user.getLeaveBalance() + leave.getNumberOfDays());
            userRepository.save(user);
        }
        
        leave.setStatus(LeaveStatus.CANCELLED);
        leaveRepository.save(leave);
    }
    
    public LeaveDTO.LeaveBalanceResponse getLeaveBalance(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Leave> approvedLeaves = leaveRepository.findByUserIdAndStatus(user.getId(), LeaveStatus.APPROVED);
        double usedLeave = approvedLeaves.stream()
            .mapToDouble(Leave::getNumberOfDays)
            .sum();
        
        long pendingRequests = leaveRepository.findByUserIdAndStatus(user.getId(), LeaveStatus.PENDING).size();
        
        return new LeaveDTO.LeaveBalanceResponse(
            20.0, // Total annual leave
            usedLeave,
            user.getLeaveBalance(),
            pendingRequests
        );
    }
    
    private LeaveDTO.LeaveResponse mapToResponse(Leave leave) {
        LeaveDTO.LeaveResponse response = new LeaveDTO.LeaveResponse();
        response.setId(leave.getId());
        response.setUserId(leave.getUser().getId());
        response.setUserName(leave.getUser().getFullName());
        response.setUserEmail(leave.getUser().getEmail());
        response.setDepartment(leave.getUser().getDepartment());
        response.setStartDate(leave.getStartDate());
        response.setEndDate(leave.getEndDate());
        response.setNumberOfDays(leave.getNumberOfDays());
        response.setLeaveType(leave.getLeaveType());
        response.setReason(leave.getReason());
        response.setStatus(leave.getStatus());
        response.setManagerComments(leave.getManagerComments());
        response.setApprovedAt(leave.getApprovedAt());
        response.setCreatedAt(leave.getCreatedAt());
        response.setUpdatedAt(leave.getUpdatedAt());
        
        if (leave.getApprovedBy() != null) {
            response.setApprovedByName(leave.getApprovedBy().getFullName());
        }
        
        return response;
    }
}
