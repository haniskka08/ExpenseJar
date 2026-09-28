package org.example.expensejar.repository;

import org.example.expensejar.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

    List<Budget> findByMonthAndYear(int month, int year);
}