package com.sjsu.edu.vms.repository;

import java.util.List;

import com.sjsu.edu.vms.model.Clinic;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface ClinicRepository extends CrudRepository<Clinic, String> {
  public List<Clinic> findAll();

  @Query("SELECT c FROM Clinic c WHERE c.name LIKE ?1%")
  public List<Clinic> findAllBySearch(String search);

  @Query("SELECT c FROM Clinic c WHERE c.id in ?1")
  public List<Clinic> findMultipleByIds(List<String> ids);
}
