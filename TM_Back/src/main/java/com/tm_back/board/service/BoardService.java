package com.tm_back.board.service;

import com.tm_back.board.dto.BoardFormDto;
import com.tm_back.board.entity.Board;
import com.tm_back.board.entity.BoardFile;
import com.tm_back.board.entity.Member;
import com.tm_back.board.repository.BoardRepository;
import com.tm_back.board.repository.MemberRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardService {
    private final MemberRepository memberRepository;
    private final BoardRepository boardRepository;
    private final BoardFileService boardFileService;

    public Long saveBoard(@Valid BoardFormDto boardFormDto, List<MultipartFile> boardFileList
            , String loginId) throws Exception {

        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(() -> new RuntimeException("회원이 존재하지 않습니다."));

        Board board = boardFormDto.toEntity(member); // Dto -> Entity

        boardRepository.save(board);

        if (boardFileList != null) {
            for (int i = 0; i < boardFileList.size(); i++) {
                BoardFile boardFile = new BoardFile();
                boardFile.setBoard(board);
                boardFileService.saveBoardFile(boardFile, boardFileList.get(i));
            }
        }
        return board.getId();
    }
}
