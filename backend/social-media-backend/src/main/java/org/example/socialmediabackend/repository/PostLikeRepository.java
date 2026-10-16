package org.example.socialmediabackend.repository;
import org.example.socialmediabackend.model.PostLike; import org.springframework.data.jpa.repository.JpaRepository;
public interface PostLikeRepository extends JpaRepository<PostLike,Long> { boolean existsByPostIdAndUserId(Long postId,Long userId); void deleteByPostIdAndUserId(Long postId,Long userId); void deleteByPostId(Long postId); long countByPostId(Long postId); }
