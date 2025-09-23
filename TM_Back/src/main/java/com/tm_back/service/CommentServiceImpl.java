package com.tm_back.service;

import com.tm_back.constant.Role;
import com.tm_back.dto.CommentResponseDto;
import com.tm_back.dto.CreateCommentDto;
import com.tm_back.dto.UpdateCommentDto;
import com.tm_back.entity.Board;
import com.tm_back.entity.Comment;
import com.tm_back.entity.Member;
import com.tm_back.entity.repository.BoardRepository;
import com.tm_back.entity.repository.CommentRepository;
import com.tm_back.entity.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final MemberRepository memberRepository;
    private final BoardRepository boardRepository;

    @Override
    public List<CommentResponseDto> getCommentsByBoardId(Long boardId) {
        List<Comment> comments =
                commentRepository.findByBoardIdAndParentIsNullOrderByRegTimeAsc(boardId);
        return comments.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CommentResponseDto createComment(CreateCommentDto dto) {
        Member member = memberRepository.findById(dto.getMemberId())
                .orElseThrow(() -> new RuntimeException("멤버 없음"));

        Board board = boardRepository.findById(dto.getBoardId())
                .orElseThrow(() -> new RuntimeException("게시글 없음"));

        Comment parent = null;
        if (dto.getParentCommentId() != null) {
            parent = commentRepository.findById(dto.getParentCommentId())
                    .orElseThrow(() -> new RuntimeException("부모 댓글 없음"));
        }

        Comment comment = Comment.builder()
                .content(dto.getContent())
                .board(board)
                .member(member)
                .parent(parent)
                .build();

        Comment saved = commentRepository.saveAndFlush(comment);
        log.info("📌 저장 완료: id={}, board={}, member={}, parent={}",
                saved.getId(),
                saved.getBoard() != null ? saved.getBoard().getId() : null,
                saved.getMember() != null ? saved.getMember().getId() : null,
                saved.getParent() != null ? saved.getParent().getId() : null
        );

        return toDto(saved);
    }

    @Override
    @Transactional
    public CommentResponseDto updateComment(Long id, UpdateCommentDto dto, Long memberId) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("댓글 없음"));
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("멤버 없음"));

        if (!comment.getMember().getId().equals(member.getId())
                && member.getRole() != Role.ADMIN) {
            throw new RuntimeException("권한이 없습니다.");
        }

        comment.setContent(dto.getContent());
        return toDto(commentRepository.saveAndFlush(comment));
    }

    @Override
    @Transactional
    public void deleteComment(Long id, Long memberId) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("댓글 없음"));
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("멤버 없음"));

        if (!comment.getMember().getId().equals(member.getId())
                && member.getRole() != Role.ADMIN) {
            throw new RuntimeException("권한이 없습니다.");
        }

        commentRepository.delete(comment);
    }

    private CommentResponseDto toDto(Comment comment) {
        CommentResponseDto dto = new CommentResponseDto();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setRegTime(comment.getRegTime());
        dto.setUpdateTime(comment.getUpdateTime());

        if (comment.getBoard() != null) {
            dto.setBoardId(comment.getBoard().getId());
        }
        if (comment.getMember() != null) {
            dto.setMemberId(comment.getMember().getId());
            dto.setMemberNickname(comment.getMember().getNickname());
        }

        dto.setReplies(
                comment.getChildren() != null
                        ? comment.getChildren().stream()
                        .map(this::toDto)
                        .collect(Collectors.toList())
                        : List.of()
        );
        return dto;
    }
}
