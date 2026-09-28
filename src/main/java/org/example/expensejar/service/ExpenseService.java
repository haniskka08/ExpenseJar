package org.example.expensejar.service;

import org.example.expensejar.dto.CategorySpendingDTO;
import org.example.expensejar.dto.MonthlySpendingDTO;
import org.example.expensejar.entity.Expense;
import org.example.expensejar.exception.ResourceNotFoundException;
import org.example.expensejar.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public Expense createExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    public Optional<Expense> getExpenseById(Long id) {
        return expenseRepository.findById(id);
    }

    public double getTotalExpense() {
        return expenseRepository.getTotalExpense();
    }

    public List<CategorySpendingDTO> getCurrentMonthSpendingByCategory() {
        YearMonth currentMonth = YearMonth.now();
        LocalDate startDate = currentMonth.atDay(1);
        LocalDate endDate = currentMonth.atEndOfMonth();
        return expenseRepository.getCurrentMonthSpendingByCategory(startDate, endDate);
    }

    public List<MonthlySpendingDTO> getMonthlySpendingTrends() {
        List<Object[]> results = expenseRepository.getMonthlySpendingTrends();
        List<MonthlySpendingDTO> trends = new ArrayList<>();
        for (Object[] row : results) {
            int year = ((Number) row[0]).intValue();
            int month = ((Number) row[1]).intValue();
            double total = ((Number) row[2]).doubleValue();
            String formattedMonth = String.format("%04d-%02d", year, month);
            trends.add(new MonthlySpendingDTO(formattedMonth, total));
        }
        return trends;
    }

    public Expense updateExpense(Long id, Expense expense) {
        Expense existingExpense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));

        existingExpense.setAmount(expense.getAmount());
        existingExpense.setDate(expense.getDate());
        existingExpense.setCategory(expense.getCategory());
        existingExpense.setUser(expense.getUser());

        return expenseRepository.save(existingExpense);
    }

    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }
}
