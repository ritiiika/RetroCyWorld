package org.example.socialmediabackend.security;
import jakarta.servlet.*; import jakarta.servlet.http.*; import org.springframework.security.authentication.UsernamePasswordAuthenticationToken; import org.springframework.security.core.authority.AuthorityUtils; import org.springframework.security.core.context.SecurityContextHolder; import org.springframework.web.filter.OncePerRequestFilter; import java.io.IOException;
public class JwtAuthenticationFilter extends OncePerRequestFilter {
 private final JwtUtil jwtUtil; public JwtAuthenticationFilter(JwtUtil jwtUtil){this.jwtUtil=jwtUtil;}
 @Override protected void doFilterInternal(HttpServletRequest req,HttpServletResponse res,FilterChain chain)throws ServletException,IOException {String header=req.getHeader("Authorization");if(header!=null&&header.startsWith("Bearer ")){String email=jwtUtil.validateAndGetEmail(header.substring(7));if(email!=null&&SecurityContextHolder.getContext().getAuthentication()==null){var auth=new UsernamePasswordAuthenticationToken(email,null,AuthorityUtils.createAuthorityList("ROLE_USER"));SecurityContextHolder.getContext().setAuthentication(auth);}}chain.doFilter(req,res);}
}
