CREATE VIRTUAL TABLE JobSearch USING fts5(jobPostId UNINDEXED, title, organization, department, qualification, details, tokenize='unicode61 remove_diacritics 2');
CREATE TRIGGER JobPost_ai AFTER INSERT ON JobPost BEGIN
  INSERT INTO JobSearch(jobPostId,title,organization,department,qualification,details) VALUES(new.id,new.title,new.organization,coalesce(new.department,''),CAST(new.qualification AS TEXT),CAST(new.importantDates AS TEXT)||' '||CAST(new.howToApply AS TEXT)||' '||CAST(new.documentsRequired AS TEXT)||' '||coalesce(new.qualificationText,''));
END;
CREATE TRIGGER JobPost_ad AFTER DELETE ON JobPost BEGIN DELETE FROM JobSearch WHERE jobPostId=old.id; END;
CREATE TRIGGER JobPost_au AFTER UPDATE ON JobPost BEGIN
  DELETE FROM JobSearch WHERE jobPostId=old.id;
  INSERT INTO JobSearch(jobPostId,title,organization,department,qualification,details) VALUES(new.id,new.title,new.organization,coalesce(new.department,''),CAST(new.qualification AS TEXT),CAST(new.importantDates AS TEXT)||' '||CAST(new.howToApply AS TEXT)||' '||CAST(new.documentsRequired AS TEXT)||' '||coalesce(new.qualificationText,''));
END;
