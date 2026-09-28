package org.example.expensejar.repository;

import org.example.expensejar.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
}