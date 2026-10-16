package org.example.socialmediabackend.repository;
import org.example.socialmediabackend.model.Post; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface PostRepository extends JpaRepository<Post,Long> { List<Post> findAllByOrderByCreatedAtDesc(); List<Post> findByUserIdOrderByCreatedAtDesc(Long userId); }
