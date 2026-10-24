CREATE VIRTUAL TABLE IF NOT EXISTS SchemeSearch USING fts5(schemeId UNINDEXED, title, provider, benefits, tokenize='unicode61 remove_diacritics 2');
CREATE VIRTUAL TABLE IF NOT EXISTS KnowledgeSearch USING fts5(chunkId UNINDEXED, topic, text, tokenize='unicode61 remove_diacritics 2');

INSERT INTO SchemeSearch(schemeId,title,provider,benefits) SELECT id,title,provider,benefits FROM Scheme;
INSERT INTO KnowledgeSearch(chunkId,topic,text) SELECT id,topic,text FROM KnowledgeChunk;

CREATE TRIGGER IF NOT EXISTS SchemeSearch_insert AFTER INSERT ON Scheme BEGIN INSERT INTO SchemeSearch(schemeId,title,provider,benefits) VALUES(new.id,new.title,new.provider,new.benefits); END;
CREATE TRIGGER IF NOT EXISTS SchemeSearch_delete AFTER DELETE ON Scheme BEGIN DELETE FROM SchemeSearch WHERE schemeId=old.id; END;
CREATE TRIGGER IF NOT EXISTS SchemeSearch_update AFTER UPDATE OF title,provider,benefits ON Scheme BEGIN DELETE FROM SchemeSearch WHERE schemeId=old.id; INSERT INTO SchemeSearch(schemeId,title,provider,benefits) VALUES(new.id,new.title,new.provider,new.benefits); END;
CREATE TRIGGER IF NOT EXISTS KnowledgeSearch_insert AFTER INSERT ON KnowledgeChunk BEGIN INSERT INTO KnowledgeSearch(chunkId,topic,text) VALUES(new.id,new.topic,new.text); END;
CREATE TRIGGER IF NOT EXISTS KnowledgeSearch_delete AFTER DELETE ON KnowledgeChunk BEGIN DELETE FROM KnowledgeSearch WHERE chunkId=old.id; END;
CREATE TRIGGER IF NOT EXISTS KnowledgeSearch_update AFTER UPDATE OF topic,text ON KnowledgeChunk BEGIN DELETE FROM KnowledgeSearch WHERE chunkId=old.id; INSERT INTO KnowledgeSearch(chunkId,topic,text) VALUES(new.id,new.topic,new.text); END;
