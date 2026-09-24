package llmhub.llmhub.service;

import llmhub.llmhub.domain.User;
import llmhub.llmhub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public void updateUserToken(String refresh_token, String email) {
        User user = this.userRepository.findByEmail(email);
        user.setRefreshToken(refresh_token);
        this.userRepository.save(user);
    }
}
