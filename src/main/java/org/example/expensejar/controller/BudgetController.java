package org.example.expensejar.controller;

import org.example.expensejar.entity.Budget;
import org.example.expensejar.service.BudgetService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @PostMapping
    public Budget createBudget(@RequestBody Budget budget) {
        return budgetService.createBudget(budget);
    }

    @GetMapping
    public List<Budget> getAllBudgets() {
        return budgetService.getAllBudgets();
    }

    @GetMapping("/{id}")
    public Budget getBudgetById(@PathVariable Long id) {
        return budgetService.getBudgetById(id).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);
    }
}