package org.example.socialmediabackend.exception;
import org.springframework.http.*;import org.springframework.web.bind.annotation.*;import java.util.*;
@RestControllerAdvice public class GlobalExceptionHandler {
 @ExceptionHandler(ResourceNotFoundException.class) public ResponseEntity<Map<String,String>> notFound(ResourceNotFoundException e){return ResponseEntity.status(404).body(Map.of("message",e.getMessage()));}
 @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class) public ResponseEntity<Map<String,String>> conflict(Exception e){return ResponseEntity.status(409).body(Map.of("message","A record with the same unique value already exists"));}
}
