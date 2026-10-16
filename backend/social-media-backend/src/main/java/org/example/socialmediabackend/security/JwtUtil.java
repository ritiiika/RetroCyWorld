package org.example.socialmediabackend.security;
import javax.crypto.Mac; import javax.crypto.spec.SecretKeySpec; import java.nio.charset.StandardCharsets; import java.time.Instant; import java.util.Base64; import java.util.regex.*;
import org.springframework.beans.factory.annotation.Value; import org.springframework.stereotype.Component;
@Component public class JwtUtil {
 private final byte[] secret; private final long expirationSeconds;
 public JwtUtil(@Value("${app.jwt.secret:local-dev-secret-change-this-to-a-long-random-value-please}") String secret,@Value("${app.jwt.expiration-seconds:86400}") long expirationSeconds){this.secret=secret.getBytes(StandardCharsets.UTF_8);this.expirationSeconds=expirationSeconds;}
 public String generateToken(String email){long now=Instant.now().getEpochSecond();String h=encode("{\"alg\":\"HS256\",\"typ\":\"JWT\"}");String safe=email.replace("\\","\\\\").replace("\"","\\\"");String p=encode("{\"sub\":\""+safe+"\",\"iat\":"+now+",\"exp\":"+(now+expirationSeconds)+"}");String body=h+"."+p;return body+"."+Base64.getUrlEncoder().withoutPadding().encodeToString(sign(body));}
 public String validateAndGetEmail(String token){try{String[] parts=token.split("\\.");if(parts.length!=3)return null;String body=parts[0]+"."+parts[1];if(!java.security.MessageDigest.isEqual(sign(body),Base64.getUrlDecoder().decode(parts[2])))return null;String payload=new String(Base64.getUrlDecoder().decode(parts[1]),StandardCharsets.UTF_8);Matcher sub=Pattern.compile("\"sub\"\\s*:\\s*\"([^\"]+)\"").matcher(payload);Matcher exp=Pattern.compile("\"exp\"\\s*:\\s*(\\d+)").matcher(payload);if(!sub.find()||!exp.find()||Long.parseLong(exp.group(1))<Instant.now().getEpochSecond())return null;return sub.group(1);}catch(Exception e){return null;}}
 private byte[] sign(String s){try{Mac mac=Mac.getInstance("HmacSHA256");mac.init(new SecretKeySpec(secret,"HmacSHA256"));return mac.doFinal(s.getBytes(StandardCharsets.UTF_8));}catch(Exception e){throw new IllegalStateException(e);}}
 private String encode(String s){return Base64.getUrlEncoder().withoutPadding().encodeToString(s.getBytes(StandardCharsets.UTF_8));}
}
