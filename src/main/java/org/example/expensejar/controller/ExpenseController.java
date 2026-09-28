package org.example.expensejar.controller;

import jakarta.validation.Valid;
import org.example.expensejar.dto.CategorySpendingDTO;
import org.example.expensejar.dto.MonthlySpendingDTO;
import org.example.expensejar.entity.Expense;
import org.example.expensejar.service.ExpenseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping
    public ResponseEntity<Expense> createExpense(@Valid @RequestBody Expense expense) {
        return ResponseEntity.ok(expenseService.createExpense(expense));
    }

    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpenses() {
        return ResponseEntity.ok(expenseService.getAllExpenses());
    }

    @GetMapping("/total")
    public ResponseEntity<Double> getTotalExpense() {
        return ResponseEntity.ok(expenseService.getTotalExpense());
    }

    @GetMapping("/current-month/category")
    public ResponseEntity<List<CategorySpendingDTO>> getCurrentMonthSpendingByCategory() {
        return ResponseEntity.ok(expenseService.getCurrentMonthSpendingByCategory());
    }

    @GetMapping("/monthly-trends")
    public ResponseEntity<List<MonthlySpendingDTO>> getMonthlySpendingTrends() {
        return ResponseEntity.ok(expenseService.getMonthlySpendingTrends());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Expense> getExpenseById(@PathVariable Long id) {
        return expenseService.getExpenseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(
            @PathVariable Long id,
            @Valid @RequestBody Expense expense) {
        return ResponseEntity.ok(expenseService.updateExpense(id, expense));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }
}
