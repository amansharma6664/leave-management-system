package com.leavemanagement.repository;

import com.leavemanagement.model.Leave;
import com.leavemanagement.model.Leave.LeaveStatus;
import com.leavemanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface LeaveRepository extends JpaRepository<Leave, Long> {
    List<Leave> findByUser(User user);
    List<Leave> findByUserOrderByCreatedAtDesc(User user);
    List<Leave> findByStatus(LeaveStatus status);
    List<Leave> findAllByOrderByCreatedAtDesc();
    
    @Query("SELECT l FROM Leave l WHERE l.user.id = :userId AND l.status = :status")
    List<Leave> findByUserIdAndStatus(Long userId, LeaveStatus status);
    
    @Query("SELECT l FROM Leave l WHERE l.user.id = :userId AND " +
           "((l.startDate BETWEEN :startDate AND :endDate) OR " +
           "(l.endDate BETWEEN :startDate AND :endDate) OR " +
           "(l.startDate <= :startDate AND l.endDate >= :endDate))")
    List<Leave> findOverlappingLeaves(Long userId, LocalDate startDate, LocalDate endDate);
}
