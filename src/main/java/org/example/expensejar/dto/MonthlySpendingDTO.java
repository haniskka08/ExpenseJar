package org.example.expensejar.dto;

public class MonthlySpendingDTO {

    private String month;
    private double total;

    public MonthlySpendingDTO() {
    }

    public MonthlySpendingDTO(String month, double total) {
        this.month = month;
        this.total = total;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }
}
