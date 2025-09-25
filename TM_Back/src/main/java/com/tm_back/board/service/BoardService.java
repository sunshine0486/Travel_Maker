package com.tm_back.board.service;

import com.tm_back.board.dto.BoardFileDto;
import com.tm_back.board.dto.BoardFormDto;
import com.tm_back.board.entity.*;
import com.tm_back.board.repository.BoardFileRepository;
import com.tm_back.board.repository.BoardRepository;
import com.tm_back.board.repository.LikesRepository;
import com.tm_back.board.repository.MemberRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BoardService {
    private final MemberRepository memberRepository;
    private final BoardRepository boardRepository;
    private final BoardFileRepository boardFileRepository;
    private final BoardFileService boardFileService;
    private final LikesRepository likesRepository;

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

    /// 댓글이랑 같이 보내야함.
    @Transactional(readOnly = true)
    public BoardFormDto getBoardDtl(Long boardId, Long memberId) {
        /// board_id인 사진 목록 ID 오름차순으로 조회하기
        List<BoardFile> boardFileList = boardFileRepository.findByBoardIdOrderByIdAsc(boardId);
        List<BoardFileDto> boardFileDtoList = new ArrayList<>();

        // 사진 꺼내서 FileDTO에 매핑
        for(BoardFile boardImg : boardFileList ){
            boardFileDtoList.add(BoardFileDto.toDto(boardImg));
        }

        // board갖고오기
        Board board = boardRepository.findById(boardId).orElseThrow(EntityNotFoundException::new);

        // memberId가 이 boardId에 좋아요를 했는지?
        boolean isLiked = false; // 비회원이면
        if (memberId != null) { //회원일경우
            isLiked = likesRepository.existsByBoardIdAndMemberId(boardId, memberId);
        }

        // 게시글의 좋아요 개수 세기
        int likeCount = likesRepository.countByBoardId(boardId);

        //formdto로 변환
        BoardFormDto boardFormDto = BoardFormDto.toDto(board);
        boardFormDto.setBoardFileDtoList(boardFileDtoList);
        boardFormDto.setIsLiked(isLiked); // 좋아요 여부
        boardFormDto.setLikeCount(likeCount); // 좋아요 개수 세팅
        return boardFormDto;
    }

    public void likeBoard(Long boardId, Long memberId) {
        if (memberId == null) {
            throw new RuntimeException("로그인이 필요한 기능입니다."); // 비회원 처리
        }

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다."));

        // 좋아요 했는지 확인
        boolean alreadyLiked = likesRepository.existsByBoardIdAndMemberId(boardId, memberId);

        if (alreadyLiked) {
            // 좋아요 취소
            likesRepository.deleteByBoardIdAndMemberId(boardId, memberId);
        } else {
            // 좋아요 추가
            Member member = memberRepository.findById(memberId)
                    .orElseThrow(() -> new EntityNotFoundException("회원 정보를 찾을 수 없습니다."));

            Likes like = Likes.builder()
                    .id(new LikesId(boardId, memberId))
                    .board(board)
                    .member(member)
                    .build();

            likesRepository.save(like);
        }

    }

    @Value("${boardFileLocation}")
    private String boardImgLocation;
    public Long updateBoard(BoardFormDto boardFormDto, List<MultipartFile> boardFileList) throws Exception {
        // 1. 게시글 엔티티 조회
        Board board = boardRepository.findById(boardFormDto.getId())
                .orElseThrow(EntityNotFoundException::new);

        // 2. 게시글 내용 업데이트
        board.updateBoard(boardFormDto);

        // 3. 기존 첨부파일 삭제
        // 게시글의 모든 파일 불러오기
        List<BoardFile> oldFiles = boardFileRepository.findByBoardIdOrderByIdAsc(board.getId());
        for (BoardFile oldFile : oldFiles) {
            // 기존에 저장된 파일명이 있을 경우, 실제 서버 저장소에서 삭제
            if (oldFile.getFileName() != null) {
                boardFileService.deleteFile(boardImgLocation + "/" + oldFile.getFileName());
            }
            // DB에서도 해당 파일 레코드 삭제
            boardFileRepository.delete(oldFile);
        }

        // 4. 새 이미지 저장
        if (boardFileList != null && !boardFileList.isEmpty()) {
            for (MultipartFile newFile : boardFileList) {
                System.out.println("새로운 파일!!!!!!!!!!!!!!!"+newFile);
                // 실제 업로드된 파일만 처리 (null/빈 파일 제외)
                if (newFile != null && !newFile.isEmpty()) {
                    BoardFile boardFile = new BoardFile();
                    boardFile.setBoard(board);
                    boardFileService.saveBoardFile(boardFile, newFile);
                }
            }
        }

        return board.getId();
    }

    public Long deleteBoard(Long boardId) throws Exception {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(EntityNotFoundException::new);

        // BoardImg 삭제 (ID 기준)
        List<BoardFile> files = boardFileRepository.findByBoardIdOrderByIdAsc(boardId);
        for (BoardFile file : files) {
            if (file.getFileName() != null) {
                boardFileService.deleteFile(boardImgLocation + "/" + file.getFileName());
            }
            boardFileRepository.delete(file);
        }

        // Board 삭제
        boardRepository.deleteById(boardId);

        return boardId;
    }
}
