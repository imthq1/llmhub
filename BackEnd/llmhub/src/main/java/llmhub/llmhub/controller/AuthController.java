package llmhub.llmhub.controller;

import jakarta.servlet.http.HttpServletRequest;
import llmhub.llmhub.config.Oauth2.GoogleUtils;
import llmhub.llmhub.config.Oauth2.oauth2.GooglePojo;
import llmhub.llmhub.domain.User;
import llmhub.llmhub.domain.response.ResLoginDTO;
import llmhub.llmhub.repository.UserRepository;
import llmhub.llmhub.service.UserService;
import llmhub.llmhub.util.SecurityUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1")
public class AuthController {
    private final SecurityUtil securityUtil;
    private final UserRepository userRepository;
    private final GoogleUtils googleUtils;
    private final UserService userService;
    public AuthController( SecurityUtil securityUtil,
                           UserRepository userRepository, GoogleUtils googleUtils, UserService userService) {
        this.securityUtil = securityUtil;
        this.userRepository = userRepository;
        this.googleUtils = googleUtils;
        this.userService = userService;
    }

    @Value("${imthang.jwt.refresh-token-validity-in-seconds}")
    private long refreshTokenExpiration;

    @Value("${app.auth.refresh-cookie-secure:true}")

    private boolean refreshCookieSecure;
    private final Set<String> processedCodes = Collections.synchronizedSet(new HashSet<>());

    private boolean isCodeProcessed(String code) {
        return processedCodes.contains(code);
    }

    private void markCodeAsProcessed(String code) {
        processedCodes.add(code);
    }

    /**
     * Google must be configured with this exact redirect URI. The authorization code is exchanged
     * only on the server, so neither the Google client secret nor Google's access token reaches UI.
     */
    @RequestMapping(value ="/login/oauth2/code/google", method = RequestMethod.GET)
    public ResponseEntity<Object> loginGoogle(HttpServletRequest request) {

        String code = request.getParameter("code");
        System.out.println(code);
        if (code == null || code.isEmpty()) {
            return ResponseEntity.badRequest().body("Lỗi: Không lấy được mã xác thực từ Google.");
        }
        if (isCodeProcessed(code)) {
            return ResponseEntity.badRequest().body("Mã code đã được sử dụng.");
        }
        try {
            markCodeAsProcessed(code);
            // Lấy Access Token từ Google
            String accessToken = googleUtils.getToken(code);
            // Lấy thông tin người dùng từ Google
            GooglePojo googlePojo = googleUtils.getUserInfo(accessToken);
            // Xây dựng thông tin người dùng trong hệ thống
            User user = googleUtils.buildUser(googlePojo);

            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(user, user.getPassword());
            SecurityContextHolder.getContext().setAuthentication(authentication);

            ResLoginDTO resLoginDTO = new ResLoginDTO();

            if (user != null) {
                ResLoginDTO.UserLogin userLogin = new ResLoginDTO.UserLogin(
                        user.getId()
                        , user.getEmail()
                        , user.getFullname()
                     );

                resLoginDTO.setUserLogin(userLogin);
            }

            String accessTokenJWT = this.securityUtil.createAcessToken(user.getEmail(),resLoginDTO);
            String refreshTokenJWT = this.securityUtil.createRefreshToken(user.getEmail(),resLoginDTO);

            this.userService.updateUserToken(refreshTokenJWT, user.getEmail());

            Map<String, Object> response = new HashMap<>();
            response.put("status", "Đăng nhập thành công.");
            response.put("access_token", accessTokenJWT);
            response.put("user", Map.of("email", user.getEmail(), "name", user.getFullname(), "role", "user"));

            ResponseCookie resCookies = ResponseCookie.from("refresh_token1", refreshTokenJWT)
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .maxAge(refreshTokenExpiration)
                    .build();
            return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, resCookies.toString()).body(response);

        } catch (Exception e) {
            // Ghi log lỗi
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi trong quá trình xử lý.");
        }
    }

}
