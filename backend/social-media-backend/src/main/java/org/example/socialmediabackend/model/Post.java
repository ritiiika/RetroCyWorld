package org.example.socialmediabackend.model;
import jakarta.persistence.*; import java.time.Instant;
@Entity @Table(name="posts")
public class Post {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(fetch=FetchType.EAGER,optional=false) @JoinColumn(name="user_id",nullable=false) private User user;
 @Column(length=1000) private String content; @Column(length=2048) private String imageUrl;
 @Column(nullable=false) private int likes=0; @Column(nullable=false) private int shares=0;
 @Column(nullable=false,updatable=false) private Instant createdAt=Instant.now();
 public Post(){} public Long getId(){return id;} public User getUser(){return user;} public void setUser(User v){user=v;} public String getContent(){return content;} public void setContent(String v){content=v;} public String getImageUrl(){return imageUrl;} public void setImageUrl(String v){imageUrl=v;} public int getLikes(){return likes;} public void setLikes(int v){likes=v;} public int getShares(){return shares;} public void setShares(int v){shares=v;} public Instant getCreatedAt(){return createdAt;}
}
