package org.example.expensejar.repository;

import org.example.expensejar.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}