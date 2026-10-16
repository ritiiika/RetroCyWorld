package org.example.socialmediabackend.repository;
import org.example.socialmediabackend.model.Comment; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface CommentRepository extends JpaRepository<Comment,Long> { List<Comment> findByPostIdOrderByCreatedAtAsc(Long postId); void deleteByPostId(Long postId); }
