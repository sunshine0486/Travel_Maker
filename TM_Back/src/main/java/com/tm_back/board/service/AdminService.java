package com.tm_back.board.service;

import com.tm_back.board.dto.FileSettingDto;
import com.tm_back.board.entity.FileSetting;
import com.tm_back.board.repository.FileSettingRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;

@Service
@Transactional
@RequiredArgsConstructor
public class AdminService {

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
