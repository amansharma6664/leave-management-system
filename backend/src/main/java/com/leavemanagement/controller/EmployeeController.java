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
@RequestMapping("/api/employee")
@CrossOrigin(origins = "*", maxAge = 3600)
public class EmployeeController {
    
    @Autowired
    private LeaveService leaveService;
    
    @PostMapping("/leaves")
    public ResponseEntity<?> applyLeave(@Valid @RequestBody LeaveDTO.LeaveRequest request,
                                       Authentication authentication) {
        try {
            String username = authentication.getName();
            LeaveDTO.LeaveResponse response = leaveService.applyLeave(username, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/leaves")
    public ResponseEntity<List<LeaveDTO.LeaveResponse>> getMyLeaves(Authentication authentication) {
        String username = authentication.getName();
        List<LeaveDTO.LeaveResponse> leaves = leaveService.getMyLeaves(username);
        return ResponseEntity.ok(leaves);
    }
    
    @GetMapping("/leaves/balance")
    public ResponseEntity<LeaveDTO.LeaveBalanceResponse> getLeaveBalance(Authentication authentication) {
        String username = authentication.getName();
        LeaveDTO.LeaveBalanceResponse balance = leaveService.getLeaveBalance(username);
        return ResponseEntity.ok(balance);
    }
    
    @DeleteMapping("/leaves/{id}")
    public ResponseEntity<?> cancelLeave(@PathVariable Long id, Authentication authentication) {
        try {
            String username = authentication.getName();
            leaveService.cancelLeave(username, id);
            return ResponseEntity.ok(new MessageResponse("Leave cancelled successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    // Helper classes
    public static class MessageResponse {
        private String message;
        
        public MessageResponse(String message) {
            this.message = message;
        }
        
        public String getMessage() {
            return message;
        }
        
        public void setMessage(String message) {
            this.message = message;
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
