package com.leavemanagement.controller;

import com.leavemanagement.dto.LeaveDTO;
import com.leavemanagement.service.LeaveService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/manager")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ManagerController {
    
    @Autowired
    private LeaveService leaveService;
    
    @GetMapping("/leaves")
    public ResponseEntity<List<LeaveDTO.LeaveResponse>> getAllLeaves() {
        List<LeaveDTO.LeaveResponse> leaves = leaveService.getAllLeaves();
        return ResponseEntity.ok(leaves);
    }
    
    @GetMapping("/leaves/pending")
    public ResponseEntity<List<LeaveDTO.LeaveResponse>> getPendingLeaves() {
        List<LeaveDTO.LeaveResponse> leaves = leaveService.getPendingLeaves();
        return ResponseEntity.ok(leaves);
    }
    
    @PutMapping("/leaves/{id}/approve")
    public ResponseEntity<?> approveOrRejectLeave(@PathVariable Long id,
                                                  @Valid @RequestBody LeaveDTO.LeaveApprovalRequest request,
                                                  Authentication authentication) {
        try {
            String managerUsername = authentication.getName();
            LeaveDTO.LeaveResponse response = leaveService.approveOrRejectLeave(managerUsername, id, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    public static class ErrorResponse {
        private String error;
        
        public ErrorResponse(String error) {
            this.error = error;
        }
        
        public String getError() {
            return error;
        }
        
        public void setError(String error) {
            this.error = error;
        }
    }
}
