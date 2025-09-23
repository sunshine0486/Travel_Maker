//package com.tm_back.service;
//
//import com.tm_back.entity.Board;
//import com.tm_back.entity.Comment;
//import com.tm_back.entity.Member;
//import com.tm_back.dto.CommentResponseDto;
//import com.tm_back.dto.CreateCommentDto;
//import com.tm_back.dto.UpdateCommentDto;
//import com.tm_back.entity.repository.BoardRepository;
//import com.tm_back.entity.repository.CommentRepository;
//import com.tm_back.entity.repository.MemberRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//public class CommentServiceImpl_권한전 implements CommentService {
//
//    private final CommentRepository commentRepository;
//    private final BoardRepository boardRepository;
//    private final MemberRepository memberRepository;
//
//    @Override
//    @Transactional(readOnly = true)
//    public List<CommentResponseDto> getCommentsByBoard(Long boardId) {
//        List<Comment> comments = commentRepository.findByBoardIdAndParentIsNullOrderByRegTimeAsc(boardId);
//        return comments.stream()
//                .map(this::toDto)
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    @Transactional
//    public CommentResponseDto addComment(CreateCommentDto dto) {
//        Board board = boardRepository.findById(dto.getBoardId())
//                .orElseThrow(() -> new IllegalArgumentException("Board not found"));
//        Member member = memberRepository.findById(dto.getMemberId())
//                .orElseThrow(() -> new IllegalArgumentException("Member not found"));
//
//        Comment comment = new Comment();
//        comment.setBoard(board);
//        comment.setMember(member);
//        comment.setContent(dto.getContent());
//
//        if (dto.getParentCommentId() != null) {
//            Comment parent = commentRepository.findById(dto.getParentCommentId())
//                    .orElseThrow(() -> new IllegalArgumentException("Parent comment not found"));
//            comment.setParent(parent);
//        }
//
//        Comment saved = commentRepository.save(comment);
//        return toDto(saved);
//    }
//
//    @Override
//    @Transactional
//    public CommentResponseDto updateComment(Long commentId, UpdateCommentDto dto) {
//        Comment comment = commentRepository.findById(commentId)
//                .orElseThrow(() -> new IllegalArgumentException("Comment not found"));
//        comment.setContent(dto.getContent());
//        return toDto(comment);
//    }
//
//    @Override
//    @Transactional
//    public void deleteComment(Long commentId) {
//        Comment comment = commentRepository.findById(commentId)
//                .orElseThrow(() -> new IllegalArgumentException("Comment not found"));
//        commentRepository.delete(comment);
//    }
//
//    // Entity → DTO 변환
//    private CommentResponseDto toDto(Comment comment) {
//        CommentResponseDto dto = new CommentResponseDto();
//        dto.setId(comment.getId());
//        dto.setContent(comment.getContent());
//        dto.setRegTime(comment.getRegTime());
//        dto.setUpdateTime(comment.getUpdateTime());
//        dto.setBoardId(comment.getBoard().getId());
//        dto.setMemberId(comment.getMember().getId());
//        dto.setMemberNickname(comment.getMember().getNickname());
//
//        // ✅ children을 재귀적으로 DTO 변환
//        List<CommentResponseDto> childDtos = comment.getChildren().stream()
//                .map(this::toDto)
//                .toList();
//
//        dto.setReplies(childDtos);
//
//        return dto;
//    }
//
//}
