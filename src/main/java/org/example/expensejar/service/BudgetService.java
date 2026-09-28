package org.example.expensejar.service;

import org.example.expensejar.dto.BudgetAlertDTO;
import org.example.expensejar.dto.BudgetUsageDTO;
import org.example.expensejar.entity.Budget;
import org.example.expensejar.exception.ResourceNotFoundException;
import org.example.expensejar.repository.BudgetRepository;
import org.example.expensejar.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;

    public BudgetService(BudgetRepository budgetRepository, ExpenseRepository expenseRepository) {
        this.budgetRepository = budgetRepository;
        this.expenseRepository = expenseRepository;
    }

    public Budget createBudget(Budget budget) {
        return budgetRepository.save(budget);
    }

    public List<Budget> getAllBudgets() {
        return budgetRepository.findAll();
    }

    public Optional<Budget> getBudgetById(Long id) {
        return budgetRepository.findById(id);
    }

    public List<BudgetUsageDTO> getBudgetUsage() {
        YearMonth current = YearMonth.now();
        int month = current.getMonthValue();
        int year = current.getYear();
        LocalDate startDate = current.atDay(1);
        LocalDate endDate = current.atEndOfMonth();

        List<Budget> budgets = budgetRepository.findByMonthAndYear(month, year);
        List<BudgetUsageDTO> usages = new ArrayList<>();

        for (Budget budget : budgets) {
            String categoryName = budget.getCategory() != null ? budget.getCategory().getName() : "Unknown";
            Long categoryId = budget.getCategory() != null ? budget.getCategory().getId() : null;

            double spent = (categoryId != null)
                    ? expenseRepository.getSpendingByCategoryAndDateRange(categoryId, startDate, endDate)
                    : 0.0;

            double budgetAmount = budget.getAmount();
            double usagePercentage = (budgetAmount > 0) ? (spent / budgetAmount) * 100.0 : 0.0;
            usagePercentage = Math.round(usagePercentage * 100.0) / 100.0;

            usages.add(new BudgetUsageDTO(categoryName, budgetAmount, spent, usagePercentage));
        }

        return usages;
    }

    public List<BudgetAlertDTO> getBudgetAlerts() {
        List<BudgetUsageDTO> usages = getBudgetUsage();
        List<BudgetAlertDTO> alerts = new ArrayList<>();

        for (BudgetUsageDTO usage : usages) {
            if (usage.getUsagePercentage() >= 90.0) {
                alerts.add(new BudgetAlertDTO(
                        usage.getCategory(),
                        usage.getBudget(),
                        usage.getSpent(),
                        usage.getUsagePercentage(),
                        "Budget usage has reached 90% or more"
                ));
            }
        }

        return alerts;
    }

    public Budget updateBudget(Long id, Budget budget) {
        Budget existingBudget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found"));

        existingBudget.setAmount(budget.getAmount());
        existingBudget.setMonth(budget.getMonth());
        existingBudget.setYear(budget.getYear());
        existingBudget.setCategory(budget.getCategory());
        existingBudget.setUser(budget.getUser());

        return budgetRepository.save(existingBudget);
    }

    public void deleteBudget(Long id) {
        budgetRepository.deleteById(id);
    }
}
