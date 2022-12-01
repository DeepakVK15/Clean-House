package com.sjsu.edu.vms.repository;

import java.util.List;

import com.sjsu.edu.vms.model.Disease;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface DiseaseRepository extends CrudRepository<Disease, String> {
  public List<Disease> findAll();

  @Query("SELECT d FROM Disease d WHERE d.name LIKE ?1%")
  public List<Disease> findAllBySearch(String search);

  @Query("SELECT d FROM Disease d WHERE d.id IN ?1")
  public List<Disease> findMultiple(List<String> ids);
}
