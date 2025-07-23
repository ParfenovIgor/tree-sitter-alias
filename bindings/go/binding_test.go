package tree_sitter_alias_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_alias "github.com/parfenovigor/tree-sitter-alias/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_alias.Language())
	if language == nil {
		t.Errorf("Error loading Alias grammar")
	}
}
