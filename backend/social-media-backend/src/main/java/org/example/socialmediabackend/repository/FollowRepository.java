package org.example.socialmediabackend.repository;
import org.example.socialmediabackend.model.Follow; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface FollowRepository extends JpaRepository<Follow,Long> { Optional<Follow> findByFollowerIdAndFollowingId(Long followerId,Long followingId); long countByFollowingId(Long id); long countByFollowerId(Long id); List<Follow> findByFollowerId(Long id); }
