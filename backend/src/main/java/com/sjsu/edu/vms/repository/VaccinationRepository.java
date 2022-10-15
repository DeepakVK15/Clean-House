package com.sjsu.edu.vms.repository;

import java.util.List;

import com.sjsu.edu.vms.model.Vaccination;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface VaccinationRepository extends CrudRepository<Vaccination, String> {
  public List<Vaccination> findAll();

  @Query("SELECT v FROM Vaccination v WHERE v.name LIKE ?1%")
  public List<Vaccination> findAllBySearch(String search);

  @Query("SELECT v FROM Vaccination v WHERE v.id in ?1")
  public List<Vaccination> findMultipleByIds(List<String> ids);
}
