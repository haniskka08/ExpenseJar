package org.example.expensejar.controller;

import jakarta.validation.Valid;
import org.example.expensejar.dto.BudgetAlertDTO;
import org.example.expensejar.dto.BudgetUsageDTO;
import org.example.expensejar.entity.Budget;
import org.example.expensejar.service.BudgetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @PostMapping
    public ResponseEntity<Budget> createBudget(@Valid @RequestBody Budget budget) {
        return ResponseEntity.ok(budgetService.createBudget(budget));
    }

    @GetMapping
    public ResponseEntity<List<Budget>> getAllBudgets() {
        return ResponseEntity.ok(budgetService.getAllBudgets());
    }

    @GetMapping("/usage")
    public ResponseEntity<List<BudgetUsageDTO>> getBudgetUsage() {
        return ResponseEntity.ok(budgetService.getBudgetUsage());
    }

    @GetMapping("/alerts")
    public ResponseEntity<List<BudgetAlertDTO>> getBudgetAlerts() {
        return ResponseEntity.ok(budgetService.getBudgetAlerts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Budget> getBudgetById(@PathVariable Long id) {
        return budgetService.getBudgetById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Budget> updateBudget(@PathVariable Long id, @Valid @RequestBody Budget budget) {
        return ResponseEntity.ok(budgetService.updateBudget(id, budget));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);
        return ResponseEntity.noContent().build();
    }
}
