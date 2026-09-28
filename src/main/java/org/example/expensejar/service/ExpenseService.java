package org.example.expensejar.service;

import org.example.expensejar.entity.Category;
import org.example.expensejar.entity.Expense;
import org.example.expensejar.entity.User;
import org.example.expensejar.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final CategoryService categoryService;
    private final UserService userService;

    public ExpenseService(
            ExpenseRepository expenseRepository,
            CategoryService categoryService,
            UserService userService) {
        this.expenseRepository = expenseRepository;
        this.categoryService = categoryService;
        this.userService = userService;
    }

    public Expense createExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    public double getTotalExpense() {
        return expenseRepository.getTotalExpense();
    }

    public Optional<Expense> getExpenseById(Long id) {
        return expenseRepository.findById(id);
    }

    public Expense updateExpense(Long id, Expense expense) {
        Expense existingExpense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        existingExpense.setAmount(expense.getAmount());
        existingExpense.setDate(expense.getDate());

        Category category = categoryService
                .getCategoryById(expense.getCategory().getId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        User user = userService
                .getUserById(expense.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        existingExpense.setCategory(category);
        existingExpense.setUser(user);

        return expenseRepository.save(existingExpense);
    }

    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }
}
