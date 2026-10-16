package org.example.socialmediabackend.repository;
import org.example.socialmediabackend.model.User; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface UserRepository extends JpaRepository<User,Long> { Optional<User> findByEmailIgnoreCase(String email); Optional<User> findByUsernameIgnoreCase(String username); boolean existsByEmailIgnoreCase(String email); boolean existsByUsernameIgnoreCase(String username); List<User> findTop10ByUsernameContainingIgnoreCaseOrFullNameContainingIgnoreCase(String username,String fullName); }
