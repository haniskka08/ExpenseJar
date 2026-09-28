package org.example.expensejar.repository;

import org.example.expensejar.dto.CategorySpendingDTO;
import org.example.expensejar.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e")
    double getTotalExpense();

    @Query("SELECT new org.example.expensejar.dto.CategorySpendingDTO(e.category.name, SUM(e.amount)) " +
           "FROM Expense e WHERE e.date >= :startDate AND e.date <= :endDate " +
           "GROUP BY e.category.name")
    List<CategorySpendingDTO> getCurrentMonthSpendingByCategory(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e " +
           "WHERE e.category.id = :categoryId AND e.date >= :startDate AND e.date <= :endDate")
    double getSpendingByCategoryAndDateRange(
            @Param("categoryId") Long categoryId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT YEAR(e.date), MONTH(e.date), SUM(e.amount) " +
           "FROM Expense e " +
           "GROUP BY YEAR(e.date), MONTH(e.date) " +
           "ORDER BY YEAR(e.date) ASC, MONTH(e.date) ASC")
    List<Object[]> getMonthlySpendingTrends();
}