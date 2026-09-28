package org.example.expensejar.repository;

import org.example.expensejar.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
}