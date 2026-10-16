package org.example.socialmediabackend.model;
import jakarta.persistence.*; import java.time.Instant;
@Entity @Table(name="follows",uniqueConstraints=@UniqueConstraint(columnNames={"follower_id","following_id"}))
public class Follow {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(fetch=FetchType.EAGER,optional=false) @JoinColumn(name="follower_id",nullable=false) private User follower;
 @ManyToOne(fetch=FetchType.EAGER,optional=false) @JoinColumn(name="following_id",nullable=false) private User following;
 @Column(nullable=false,updatable=false) private Instant createdAt=Instant.now();
 public Follow(){} public Long getId(){return id;} public User getFollower(){return follower;} public void setFollower(User v){follower=v;} public User getFollowing(){return following;} public void setFollowing(User v){following=v;}
}
