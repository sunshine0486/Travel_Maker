package com.tm_back.service;

import com.tm_back.constant.Category;
import com.tm_back.constant.DeleteStatus;
import com.tm_back.dto.BoardDto;
import com.tm_back.dto.BoardFileDto;
import com.tm_back.dto.BoardFormDto;
import com.tm_back.entity.*;
import com.tm_back.repository.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class BoardService {
    private final MemberRepository memberRepository;
    private final BoardRepository boardRepository;
    private final BoardFileRepository boardFileRepository;
    private final BoardFileService boardFileService;
    private final LikesRepository likesRepository;
    private final HashtagRepository hashtagRepository;
    private final BoardHashtagRepository boardHashtagRepository;
    private final CommentRepository commentRepository;

    public Long saveBoard(@Valid BoardFormDto boardFormDto, List<MultipartFile> boardFileList
            , String loginId) throws Exception {

        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(() -> new RuntimeException("회원이 존재하지 않습니다."));

        Board board = boardFormDto.toEntity(member); // Dto -> Entity
        boardRepository.save(board);
        // 3. 해시태그
        if (boardFormDto.getHashtags() != null && !boardFormDto.getHashtags().isEmpty()) {
            for (String tagName : boardFormDto.getHashtags()) {
                Hashtag hashtag;
                Optional<Hashtag> optionalHashtag = hashtagRepository.findByHashtagName(tagName);

                if (optionalHashtag.isPresent()) {
                    // 이미 존재하면 기존 해시태그 사용
                    hashtag = optionalHashtag.get();
                } else {
                    // 존재하지 않으면 새로 생성 후 DB 저장
                    Hashtag newHashtag = Hashtag.builder()
                            .hashtagName(tagName)
                            .build();
                    hashtag = hashtagRepository.save(newHashtag);
                }

                // BoardHashtag 테이블에 저장할 엔티티 생성
                // 반환받은 hashtag.getId()와 게시글 board.getId() 저장
                BoardHashtag boardHashtag = BoardHashtag.builder()
                        .id(new BoardHashtagId(board.getId(), hashtag.getId()))
                        .board(board)
                        .hashtag(hashtag)
                        .build();

                // cascade=ALL + orphanRemoval=true 덕분에 board 저장 시 BoardHashtag도 자동으로 DB에 저장됨
                board.getBoardHashtags().add(boardHashtag);
            }
        }

        // 첨부파일
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

        //  게시글 해시태그 추출
        List<String> hashtagNames = board.getBoardHashtags().stream()
                .map(bh -> bh.getHashtag().getHashtagName()) // BoardHashtag -> Hashtag -> 이름
                .toList();

        // memberId가 이 boardId에 좋아요를 했는지?
        boolean isLiked = false; // 비회원이면
        if (memberId != null) { //회원일경우
            isLiked = likesRepository.existsByBoardIdAndMemberId(boardId, memberId);
            System.out.println(isLiked);
        }

        // 게시글의 좋아요 개수 세기
        int likeCount = likesRepository.countByBoardId(boardId);
        // 댓글 개수
        int commentCount = commentRepository.countByBoardIdAndDelYn(boardId, DeleteStatus.N);

        //formdto로 변환
        BoardFormDto boardFormDto = BoardFormDto.toDto(board);
        boardFormDto.setBoardFileDtoList(boardFileDtoList);
        boardFormDto.setIsLiked(isLiked); // 좋아요 여부
        boardFormDto.setLikeCount(likeCount); // 좋아요 개수 세팅
        boardFormDto.setCommentCount(commentCount);
        if(board.getMember().getId().equals(memberId)){
            boardFormDto.setCanEdit(true);
            boardFormDto.setCanDel(true);
        }
        //해시태그 리스트 DTO에 세팅
        boardFormDto.setHashtags(hashtagNames);
        System.out.println("--------------------------"+boardFormDto);
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

        // 3. 기존 BoardHashtag 삭제
        if (!board.getBoardHashtags().isEmpty()) {
            List<BoardHashtag> oldTags = new ArrayList<>(board.getBoardHashtags());

            // 연관관계 끊기
            for (BoardHashtag bh : oldTags) {
                bh.setBoard(null);   // 🔥 board 연결 해제
                bh.setHashtag(null); // 🔥 hashtag 연결 해제
            }

            board.getBoardHashtags().removeAll(oldTags); // 엔티티 컬렉션에서 제거
            boardHashtagRepository.deleteAllInBatch(oldTags); // DB에서 한 번에 삭제
        }

        // 4. 새 해시태그 처리
        if (boardFormDto.getHashtags() != null && !boardFormDto.getHashtags().isEmpty()) {
            for (String tagName : boardFormDto.getHashtags()) {
                Hashtag hashtag = hashtagRepository.findByHashtagName(tagName)
                        .orElseGet(() -> hashtagRepository.save(
                                Hashtag.builder().hashtagName(tagName).build()
                        ));

                BoardHashtag boardHashtag = BoardHashtag.builder()
                        .id(new BoardHashtagId(board.getId(), hashtag.getId()))
                        .board(board)
                        .hashtag(hashtag)
                        .build();

                board.getBoardHashtags().add(boardHashtag);
            }
        }

        // 5. 기존 첨부파일 삭제
        List<BoardFile> oldFiles = boardFileRepository.findByBoardIdOrderByIdAsc(board.getId());
        for (BoardFile oldFile : oldFiles) {
            if (oldFile.getFileName() != null) {
                boardFileService.deleteFile(boardImgLocation + "/" + oldFile.getFileName());
            }
            boardFileRepository.delete(oldFile);
        }

        // 6. 새 첨부파일 저장
        if (boardFileList != null && !boardFileList.isEmpty()) {
            for (MultipartFile newFile : boardFileList) {
                if (newFile != null && !newFile.isEmpty()) {
                    BoardFile boardFile = new BoardFile();
                    boardFile.setBoard(board);
                    boardFileService.saveBoardFile(boardFile, newFile);
                }
            }
        }

        return board.getId();
    }



    public List<BoardDto> getBoardList(Category category) {
        // 카테고리별 조회인데 삭제여부가 N 인것만 출력
        List<Board> boardList = boardRepository.findByCategoryAndDelYn(category, DeleteStatus.N);

        List<BoardDto> boardDtoList = new ArrayList<>();
        for (Board board : boardList) {
            // 여기서 해시태그 추출
            List<String> hashtagNames = board.getBoardHashtags().stream()
                    .map(bh -> bh.getHashtag().getHashtagName())
                    .toList();

            BoardDto boardDto = BoardDto.builder()
                    .id(board.getId())
                    .category(board.getCategory())
                    .title(board.getTitle())
                    .content(board.getContent())
                    .hashtags(hashtagNames) // 이제 변수 있음!
                    .nickname(board.getMember().getNickname())
                    .views(board.getViews())
                    .likeCount(likesRepository.countByBoardId(board.getId()))
                    .commentCount(commentRepository.countByBoardId(board.getId()))
                    .regTime(board.getRegTime())
                    .build();

            boardDtoList.add(boardDto);
        }
        return boardDtoList;
    }

    // delYn이 Y인것만 조회
    public List<BoardDto> getDeletedBoardList() {
        // 삭제된 게시글만 조회
        List<Board> deletedBoards = boardRepository.findByDelYn(DeleteStatus.Y);

        List<BoardDto> boardDtoList = new ArrayList<>();
        for (Board board : deletedBoards) {
            // 해시태그 추출
            List<String> hashtagNames = board.getBoardHashtags().stream()
                    .map(bh -> bh.getHashtag().getHashtagName())
                    .toList();

            BoardDto boardDto = BoardDto.builder()
                    .id(board.getId())
                    .category(board.getCategory())
                    .title(board.getTitle())
                    .content(board.getContent())
                    .hashtags(hashtagNames)
                    .nickname(board.getMember().getNickname())
                    .views(board.getViews())
                    .likeCount(likesRepository.countByBoardId(board.getId()))
                    .commentCount(commentRepository.countByBoardId(board.getId()))
                    .regTime(board.getRegTime())
                    .build();

            boardDtoList.add(boardDto);
        }
        return boardDtoList;
    }



    public Long deleteBoard(Long boardId) {
        Board board = boardRepository.findById(boardId).orElseThrow(EntityNotFoundException::new);
        board.setDelYn(DeleteStatus.Y);
        return boardId;
    }

    public Long restoreBoard(Long boardId) {
        Board board = boardRepository.findById(boardId).orElseThrow(EntityNotFoundException::new);
        board.setDelYn(DeleteStatus.N);
        return boardId;
    }

    public Long increaseViewCount(Long boardId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(EntityNotFoundException::new);
        // 조회수 +1
        board.setViews(board.getViews() + 1);
        System.out.println(board);
        return boardId;
    }


    // 엑셀 다운하려고 불러오는 전체 삭제 게시글
    public List<BoardDto> getAllDeletedBoard() {
        List<Board> boards = boardRepository.findByDelYn(DeleteStatus.Y);
        return boards.stream()
                .map(board -> {
                    List<String> hashtags = board.getBoardHashtags().stream()
                            .map(bh -> bh.getHashtag().getHashtagName())
                            .toList();
                    return BoardDto.builder()
                            .id(board.getId())
                            .title(board.getTitle())
                            .nickname(board.getMember().getNickname())
                            .views(board.getViews())
                            .likeCount(likesRepository.countByBoardId(board.getId()))
                            .regTime(board.getRegTime())
                            .hashtags(hashtags)
                            .build();
                })
                .toList();
    }

}
