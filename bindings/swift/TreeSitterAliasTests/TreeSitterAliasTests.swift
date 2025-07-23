import XCTest
import SwiftTreeSitter
import TreeSitterAlias

final class TreeSitterAliasTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_alias())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Alias grammar")
    }
}
