package org.example.expensejar.repository;

import org.example.expensejar.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e")
    double getTotalExpense();
}