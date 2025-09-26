package com.tm_back.service;

import com.tm_back.dto.*;
import com.tm_back.entity.FileSetting;
import com.tm_back.repository.*;
import com.tm_back.constant.DeleteStatus;
import com.tm_back.entity.Comment;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class AdminService {

    private final MemberRepository memberRepository;
    private final BoardRepository boardRepository;
    private final CommentRepository commentRepository;
    private final LikesRepository likesRepository;

    // ===== Member =====
    public PagedResponse<MemberDto> getMembers(int page, int size) {
        var pageable = PageRequest.of(page, size);
        var result = memberRepository.findAll(pageable);
        return PagedResponse.of(result, MemberDto::from);
    }

    // ===== Board =====
    public PagedResponse<BoardDto> getBoards(int page, int size) {
        var pageable = PageRequest.of(page, size);
        // delYn = N인 게시글만 조회
        var result = boardRepository.findByDelYn(DeleteStatus.N, pageable);
        return PagedResponse.of(result, BoardDto::from);
    }

    // 삭제이력
    public PagedResponse<BoardDto> getDeletedBoard(int page, int size) {
        var pageable = PageRequest.of(page, size);

        // delYn = Y인 게시글만 조회
        var result = boardRepository.findByDelYn(DeleteStatus.Y, pageable);

        // BoardDto 변환 시 likeCount, commentCount 포함
        var dtoPage = result.map(board -> {
            return BoardDto.builder()
                    .id(board.getId())
                    .title(board.getTitle())
                    .nickname(board.getMember().getNickname())
                    .views(board.getViews())
                    .likeCount(likesRepository.countByBoardId(board.getId()))      // likeCount 추가
                    .commentCount(commentRepository.countByBoardId(board.getId())) // commentCount 추가
                    .regTime(board.getRegTime())
                    .build();
        });

        return PagedResponse.of(dtoPage, b -> b); // 이미 BoardDto라서 변환 함수는 identity
    }


    public void deleteBoard(Long id) {
        boardRepository.deleteById(id);
    }

    // ===== Comment =====
    public PagedResponse<CommentResponseDto> getComments(int page, int size) {
        // 최신순으로 보여주려면 regTime (BaseTimeEntity) 기준 내림차순
        var pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "regTime"));

        // commentRepository 에 아래에 제안하는 메서드가 있어야 합니다:
        Page<Comment> result = commentRepository.findByDelYn(DeleteStatus.N, pageable);

        // PagedResponse.of 에 매핑 람다를 넘겨 DTO 변환
        return PagedResponse.of(result, comment -> {
            CommentResponseDto dto = new CommentResponseDto();
            dto.setId(comment.getId());

            // 표시용 본문 (soft-deleted이면 대체 텍스트)
            dto.setContent(comment.getDelYn() == DeleteStatus.Y ? "삭제된 댓글입니다" : comment.getContent());

            dto.setRegTime(comment.getRegTime());
            dto.setUpdateTime(comment.getUpdateTime());

            if (comment.getBoard() != null) {
                dto.setBoardId(comment.getBoard().getId());
            }
            if (comment.getMember() != null) {
                dto.setMemberId(comment.getMember().getId());
                dto.setMemberNickname(comment.getMember().getNickname());
            }

            dto.setDelYn(comment.getDelYn() != null ? comment.getDelYn().name() : "N");

            // 자식 댓글 매핑(관리 목록에서는 간단히 빈 리스트로 내려도 되고,
            // 필요하면 children을 재귀로 매핑하도록 변경 가능)
            dto.setReplies(Collections.emptyList());

            return dto;
        });
    }

    public void softDeleteComment(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found"));
        comment.setDelYn(DeleteStatus.Y); // ✅ enum 값 사용
        commentRepository.save(comment);
    }

    //    유안코드
    private final FileSettingRepository fileSettingRepository;
    private static ModelMapper modelMapper = new ModelMapper();

    public FileSettingDto getFileSetting() {
        FileSetting fileSetting = fileSettingRepository.findById(1L).orElseThrow(EntityNotFoundException::new);
        FileSettingDto fileSettingDto = modelMapper.map(fileSetting, FileSettingDto.class);
        return fileSettingDto;
    }

    public FileSettingDto updateSetting(FileSettingDto dto) {
        FileSetting fileSetting = fileSettingRepository.findById(1L).orElseThrow(EntityNotFoundException::new);
        modelMapper.map(dto, fileSetting);

        // 저장
        FileSetting saved = fileSettingRepository.save(fileSetting);

        // Entity → DTO
        return modelMapper.map(saved, FileSettingDto.class);

    }
}
