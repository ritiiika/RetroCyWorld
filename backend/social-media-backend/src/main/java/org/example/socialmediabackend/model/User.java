package org.example.socialmediabackend.model;
import jakarta.persistence.*; import java.time.Instant;
@Entity @Table(name="app_users", uniqueConstraints={@UniqueConstraint(columnNames="email"),@UniqueConstraint(columnNames="username")})
public class User {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,length=80) private String fullName;
 @Column(nullable=false,length=30) private String username;
 @Column(nullable=false,length=254) private String email;
 @Column(nullable=false,length=200) private String passwordHash;
 @Column(length=500) private String bio;
 @Column(nullable=false,updatable=false) private Instant createdAt=Instant.now();
 public User(){} public Long getId(){return id;} public void setId(Long v){id=v;} public String getFullName(){return fullName;} public void setFullName(String v){fullName=v;} public String getUsername(){return username;} public void setUsername(String v){username=v;} public String getEmail(){return email;} public void setEmail(String v){email=v;} public String getPasswordHash(){return passwordHash;} public void setPasswordHash(String v){passwordHash=v;} public String getBio(){return bio;} public void setBio(String v){bio=v;} public Instant getCreatedAt(){return createdAt;}
}
