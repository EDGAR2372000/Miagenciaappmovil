package api.transport.exception;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

public record CustomErrorResponse(
        @JsonFormat(
                shape = JsonFormat.Shape.STRING,
                pattern = "yyyy-MM-dd hh:mm:ss a",
                locale = "en"
        )
        LocalDateTime datetime,
        String message,
        String details
) {
}
